module UtilHelper
  def custom_error_message(errors)
    error_messages = []
    errors.each do |error|
      attribute_key = ''
      if error['data_pointer'].present? && error['data_pointer'].length
        if error['data_pointer'].include?('/')
          attribute_key = (error['data_pointer'].sub! '/', '').gsub('/', '.').to_s
        else
          attribute_key = (error['data_pointer'].sub! '/', '').to_s
        end
      end
      case error['type']
      when 'required'
        error['details']['missing_keys'].each do |missing_key|
          missing_key_path = attribute_key.length.positive? ? "#{attribute_key}.#{missing_key}" : missing_key.to_s
          error_messages << {
            'type': 'required',
            'key': missing_key_path,
            'message': "'#{missing_key_path}' is required field."
          }
        end
      when 'enum'
        error_messages << {
          'type': error['type'],
          'key': attribute_key,
          'message': "'#{attribute_key}' allowed values are as follows: #{error['schema']['enum'].to_sentence}"
        }
      when 'object', 'boolean', 'string', 'array', 'integer'
        error_messages << {
          'type': error['type'],
          'key': attribute_key,
          'message': "Allowed '#{attribute_key}' value type is '#{error['type']}'."
        }
      when 'format'
        error_messages << {
          'type': error['type'],
          'key': attribute_key,
          'message': "'#{attribute_key}' value should be of '#{error['schema']['format']}'."
        }
      when 'minLength'
        error_messages << {
          'type': error['type'],
          'key': attribute_key,
          'message': "'#{attribute_key}' minimum length should be of '#{error['schema']['minLength']}' characters."
        }
      when 'maxLength'
        error_messages << {
          'type': error['type'],
          'key': attribute_key,
          'message': "'#{attribute_key}' maximum length should be of '#{error['schema']['maxLength']}' characters."
        }
      when 'minItems'
        error_messages << {
          'type': error['type'],
          'key': attribute_key,
          'message': "'#{attribute_key}' minimum item should be of '#{error['schema']['minItems']}' count."
        }
      when 'maxItems'
        error_messages << {
          'type': error['type'],
          'key': attribute_key,
          'message': "'#{attribute_key}' maximum item should be of '#{error['schema']['maxItems']}' count."
        }
      when 'minimum'
        error_messages << {
          'type': error['type'],
          'key': attribute_key,
          'message': "'#{attribute_key}' minimum value should be #{error['schema']['minimum']}."
        }
      when 'maximum'
        error_messages << {
          'type': error['type'],
          'key': attribute_key,
          'message': "'#{attribute_key}' maximum value should be #{error['schema']['maximum']}."
        }
      when 'pattern'
        error_messages << {
          'type': error['type'],
          'key': attribute_key,
          'message': "Invalid '#{attribute_key}' (for ex. #{error['schema']['pattern_example']})."
        }
      end
    end
    error_messages
  end

  def validate_form(schema, json_data)
    response = {
      'is_valid': false,
      'error': [],
      'log': []
    }
    schema = JSONSchemer.schema(schema)
    response[:is_valid] = schema.valid?(json_data)
    unless response[:is_valid]
      response[:log] = schema.validate(json_data)
      response[:error] = custom_error_message(schema.validate(json_data))
    end
    response
  end

  def convert_to_snake_case(value)
    value.downcase.underscore.gsub(/\s+/, '_')
  end
end