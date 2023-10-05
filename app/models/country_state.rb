class CountryState < CcdmsRecord
  self.table_name = 'country_states'
  scope :order_by_except_national, -> { order(Arel.sql "CASE WHEN name!='National' THEN 1 ELSE 2 END, name ASC") }
end