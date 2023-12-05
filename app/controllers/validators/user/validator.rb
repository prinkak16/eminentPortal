# app/controllers/validators/validator.rb
module Validators
  module User
    module Validator
      def assigned_ministry_validator
        {
          'type': 'object',
          'properties': {
            'user_id': {
              'type': 'integer',
              'minimum': 1 # Min length of 3 characters
            }
          },
          'required': %w[
            user_id
          ]
        }
      end

      def user_ministry_validator
        {
          'type': 'object',
          'properties': {
            'user_id': {
              'type': 'integer',
              'minimum': 1 # Min length of 3 characters
            },
            'ministry_ids': {
              'type': 'array',
              'items': {
                'type': 'integer',
                'minimum': 1 # Min length of 3 characters
              }
            }
          },
          'required': %w[
            user_id
            ministry_ids
          ]
        }
      end

    end
  end
end