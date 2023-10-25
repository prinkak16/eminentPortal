class AdministrativeDistrict < CcdmsRecord
  self.table_name = 'administrative_districts'
  belongs_to :country_state
end
