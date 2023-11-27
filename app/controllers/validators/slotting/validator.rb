# app/validators/slotting/validator.rb
module Validators
  module Slotting
    module Validator

      def slotting_organization_stats_validation
        {
          'type': 'object',
          'properties': {
            'organization_id': {
              'type': 'integer',
              'minimum': 1
            }
          },
          'required': %w[organization_id]
        }
      end
      def slotting_validation
        {
          'type': 'object',
          'properties': {
            'ministry_id': {
              'type': 'integer',
              'minimum': 1
            },
            'organization_id': {
              'type': 'integer',
              'minimum': 1
            },
            'vacancy_count': {
              'type': 'integer',
              'minimum': 1
            },
            'state_id': {
              'type': 'integer',
              'minimum': 1
            },
            'remarks': {
              'type': 'string'
            }
          },
          'required': %w[ministry_id organization_id vacancy_count state_id remarks]
        }
      end

      def unslotting_validation
        {
          'type': 'object',
          'properties': {
            'vacancies_id': {
              'type': 'array',
              'items': {
                'type': 'integer'
              },
              'minItems': 1
            },
            'remarks': {
              'type': 'string'
            }
          },
          'required': %w[vacancies_id remarks]
        }
      end

      def reslotting_validation
        {
          'type': 'object',
          'properties': {
            'vacancies_id': {
              'type': 'array',
              'items': {
                'type': 'integer'
              },
              'minItems': 1
            },
            'remarks': {
              'type': 'string'
            },
            'vacancy_count': {
              'type': 'integer',
              'minimum': 1
            },
            'state_id': {
              'type': 'integer',
              'minimum': 1
            },
            'ministry_id': {
              'type': 'integer',
              'minimum': 1
            },
            'organization_id': {
              'type': 'integer',
              'minimum': 1
            },
          },
          'required': %w[vacancies_id remarks vacancy_count state_id ministry_id organization_id]
        }
      end
    end
  end
end