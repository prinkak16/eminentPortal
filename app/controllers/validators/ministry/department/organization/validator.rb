# app/controllers/validators/validator.rb
module Validators
  module Ministry
    module Department
      module Organization
        module Validator

          def add_organization_validation
            {
              'type': 'object',
              'properties': {
                'country_state_id': {
                  'type': 'integer',
                    'minimum': 1 # Min length of 3 characters
                },
                'parent_id': {
                  'type': 'integer',
                  'minimum': 1 # Min length of 3 characters
                },
                'ministry_id': {
                  'type': 'integer',
                  'minimum': 1 # Min length of 3 characters
                },
                'department_id': {
                  'type': 'integer',
                  'minimum': 1 # Min length of 3 characters
                },
                'type': {
                  'type': 'string',
                  'enum': [
                    nil,
                    'PSU',
                    'PSB'
                  ]
                },
                'ratna_type': {
                  'type': 'string',
                  'minLength': 2, # Min length of 2 characters
                  'maxLength': 200 # Max length of 200 characters
                },
                'is_listed': {
                  'type': 'boolean'
                },
                'name': {
                  'type': 'string',
                  'minLength': 2, # Min length of 2 characters
                  'maxLength': 200 # Max length of 200 characters
                },
                'abbreviation': {
                  'type': 'string',
                  'minLength': 2, # Min length of 2 characters
                  'maxLength': 200 # Max length of 200 characters
                },
                'location': {
                  'type': 'object'
                }
              },
              'required': %w[
                ministry_id
                department_id
                name
              ]
            }
          end

          def get_organizations_validation
            {
              'type': 'object',
              'properties': {
                'ministry_id': {
                  'type': 'integer',
                  'minimum': 1 # Min length of 3 characters
                },
                'department_id': {
                  'type': 'integer',
                  'minimum': 1 # Min length of 3 characters
                }
              },
              'required': %w[
                ministry_id
                department_id
              ]
            }
          end

          def get_organization_validation
            {
              'type': 'object',
              'properties': {
                'ministry_id': {
                  'type': 'integer',
                  'minimum': 1 # Min length of 3 characters
                },
                'department_id': {
                  'type': 'integer',
                  'minimum': 1 # Min length of 3 characters
                },
                'organization_id': {
                  'type': 'integer',
                  'minimum': 1 # Min length of 3 characters
                }
              },
              'required': %w[
                ministry_id
                department_id
                organization_id
              ]
            }
          end

        end
      end
    end
  end
end