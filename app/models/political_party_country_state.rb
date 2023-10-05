class PoliticalPartyCountryState < CcdmsRecord
  self.table_name = 'political_party_country_states'
  belongs_to :country_state
  belongs_to :political_party
end