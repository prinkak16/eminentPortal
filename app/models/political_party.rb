class PoliticalParty < CcdmsRecord
  self.table_name = 'political_parties'
  has_many :political_party_country_states
end