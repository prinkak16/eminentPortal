module MetadataHelper
  include ApplicationHelper

  def fetch_genders
    [
      {
        'name': 'Male'
      },
      {
        'name': 'Female'
      },
      {
        'name': 'Others'
      }
    ]
  end

  def fetch_categories
    condition = "
      CASE person_categories.name
        WHEN 'GEN' THEN '1'
        WHEN 'OBC' THEN '2'
        WHEN 'SC' THEN '3'
        WHEN 'ST' THEN '4'
        WHEN 'Minority' THEN '5'
        else 100
    END"
    PersonCategory.all.order(Arel.sql(condition)).select('id', 'name')
  end

  def fetch_religions
    Religion.select('id', 'name')
  end

  def fetch_educations
    PersonEducation.order(:order).select('id', 'name')
  end

  def fetch_professions
    PersonProfession.select('id', 'name')
  end

  def fetch_states
    State.select('id', 'name').order(id: :asc)
  end

  def fetch_state_party_list(cs)
    PoliticalParty.joins(:political_party_country_states)
                  .where(political_party_country_states: { country_state_id: cs.id })
                  .select('id', 'name', 'abbreviation')
  end

  def fetch_required_locations(location_type, location_id, required_location_type)
    data = {
      'location_type': required_location_type,
      'locations': []
    }

    case location_type
    when 'State'
      case required_location_type
      when 'AssemblyConstituency'
        data[:locations] = AssemblyConstituency.where(country_state_id: location_id).select("CONCAT(number, ' - ',name) AS name, id AS id").order(number: :asc)
      when 'ParliamentaryConstituency'
        data[:locations] = ParliamentaryConstituency.where(country_state_id: location_id).select("CONCAT(number, ' - ',name) AS name, id AS id").order(number: :asc)
      when 'AdministrativeDistrict'
        data[:locations] = AdministrativeDistrict.where(country_state_id: location_id).select("name, id").order(name: :asc)
      end
    end
    data
  end
end