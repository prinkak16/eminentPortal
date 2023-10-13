# app/controllers/validators/validator.rb
module Validators
  module Ministry
    module Department
      module Validator

        def add_department_validation
          {
            'type': 'object',
            'properties': {
              'ministry_id': {
                'type': 'integer',
                'minimum': 1 # Min length of 3 characters
              },
              'name': {
                'type': 'string',
                'minLength': 2, # Min length of 3 characters
                'maxLength': 200 # Max length of 200 characters
              }
            },
            'required': %w[
              ministry_id
              name
            ]
          }
        end

        def get_ministry_department_validation
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

      end
    end
  end
end