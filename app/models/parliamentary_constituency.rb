class ParliamentaryConstituency < CcdmsRecord
  self.table_name = 'parliamentary_constituencies'

  belongs_to :country_state
end