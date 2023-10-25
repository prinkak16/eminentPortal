# app/controllers/validators/validator.rb
module Validators
  module Metadata
    module Validator
      def required_locations_validator
        {
          'type': 'object',
          'properties': {
            'location_type': {
              'type': 'string',
              'enum': [
                'State'
              ]
            },
            'location_id': {
              'type': 'integer',
              'minimum': 1
            },
            'required_location_type': {
              'type': 'string',
              'enum': [
                'ParliamentaryConstituency',
                'AdministrativeDistrict',
                'AssemblyConstituency'
              ]
            }
          },
          'required': %w[
            location_type
            location_id
            required_location_type
          ]
        }
      end

    end
  end
end