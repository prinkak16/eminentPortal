# app/controllers/validators/allotment/validator.rb
module Validators
  module Allotment
    module Validator

      def assign_position_info_validator
        {
          'type': 'object',
          'properties': {
            'organization_id': {
              'type': 'integer',
              'minimum': 1 # Min length of 3 characters
            }
          },
          'required': %w[
            organization_id
          ]
        }
      end

    end
  end
end