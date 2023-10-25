class AssemblyConstituency < CcdmsRecord
  self.table_name = 'assembly_constituencies'

  belongs_to :country_state
  belongs_to :parliamentary_constituency
end