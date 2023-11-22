# load 'db/sample_data.rb'
include UtilHelper

# create ministry
min_defence = Ministry.where(
  name: 'Ministry of Defence',
  slug: convert_to_snake_case('Ministry of Defence')
).first_or_create!
dept_dod = Department.where(
  ministry_id: min_defence.id,
  name: 'Department of Defence',
  slug: convert_to_snake_case('Department of Defence')
).first_or_create!
org_army = Organization.where(
  ministry_id: min_defence[:id],
  department_id: dept_dod[:id],
  name: 'Army',
  slug: convert_to_snake_case('Army'),
  ratna_type: 'Maharatna',
  abbreviation: 'ARMY'
).first_or_create!
org_air_force = Organization.where(
  ministry_id: min_defence[:id],
  department_id: dept_dod[:id],
  name: 'Air Force',
  slug: convert_to_snake_case('Air Force'),
  ratna_type: 'Maharatna',
  abbreviation: 'AF'
).first_or_create!
org_navy = Organization.where(
  ministry_id: min_defence[:id],
  department_id: dept_dod[:id],
  name: 'Navy',
  slug: convert_to_snake_case('Navy'),
  ratna_type: 'Maharatna',
  abbreviation: 'NAVY'
).first_or_create!
org_army = Organization.where(
  ministry_id: min_defence[:id],
  department_id: dept_dod[:id],
  name: 'Army Canteen',
  slug: convert_to_snake_case('Army Canteen'),
  ratna_type: 'Maharatna',
  abbreviation: 'AC'
).first_or_create!

dept_dodp = Department.where(
  ministry_id: min_defence[:id],
  name: 'Department of Defence Production',
  slug: convert_to_snake_case('Department of Defence Production')
).first_or_create!
org_drdo = Organization.where(
  ministry_id: min_defence[:id],
  department_id: dept_dodp[:id],
  name: 'Defence Research and Development Organisation',
  slug: convert_to_snake_case('Defence Research and Development Organisation'),
  ratna_type: 'Maharatna',
  abbreviation: 'DRDO'
).first_or_create!

dept_doesw = Department.where(
  ministry_id: min_defence[:id],
  name: 'Department of Ex Servicemen Welfare',
  slug: convert_to_snake_case('Department of Ex Servicemen Welfare')
).first_or_create!
org_mil_affairs = Organization.where(
  ministry_id: min_defence[:id],
  department_id: dept_doesw[:id],
  name: 'Military Affairs',
  slug: convert_to_snake_case('Military Affairs'),
  ratna_type: 'Maharatna',
  abbreviation: 'MA'
).first_or_create!

min_agriculture = Ministry.where(
  name: 'Ministry of Agriculture',
  slug: convert_to_snake_case('Ministry of Agriculture')
).first_or_create!
dept_agri = Department.where(
  ministry_id: min_agriculture.id,
  name: 'Department of Agriculture',
  slug: convert_to_snake_case('Department of Agriculture')
).first_or_create!
org_fc = Organization.where(
  ministry_id: min_agriculture[:id],
  department_id: dept_agri[:id],
  name: 'Fertilizers & Chemicals',
  slug: convert_to_snake_case('Fertilizers & Chemicals'),
  ratna_type: 'Miniratna',
  abbreviation: 'F&C'
).first_or_create!
org_machine_e = Organization.where(
  ministry_id: min_agriculture[:id],
  department_id: dept_agri[:id],
  name: 'Machinery & Equipments',
  slug: convert_to_snake_case('Machinery & Equipments'),
  ratna_type: 'Navratna',
  abbreviation: 'M&E'
).first_or_create!
dept_farm_welfare = Department.where(
  ministry_id: min_agriculture.id,
  name: 'Department of Farmers Welfare',
  slug: convert_to_snake_case('Department of Farmers Welfare')
).first_or_create!
org_loan_debt = Organization.where(
  ministry_id: min_agriculture[:id],
  department_id: dept_farm_welfare[:id],
  name: 'Loans & Debt',
  slug: convert_to_snake_case('Loans & Debt'),
  ratna_type: 'Maharatna',
  abbreviation: 'L&D'
).first_or_create!

min_technology = Ministry.where(
  name: 'Ministry of Technology',
  slug: convert_to_snake_case('Ministry of Technology')
).first_or_create!
dept_esdm = Department.where(
  ministry_id: min_technology.id,
  name: 'Department of Electronics System Design & Manufacturing',
  slug: convert_to_snake_case('Department of Electronics System Design & Manufacturing')
).first_or_create!
org_coe = Organization.where(
  ministry_id: min_technology[:id],
  department_id: dept_esdm[:id],
  name: 'Innovation & IPR and Centre of Excellence Projects',
  slug: convert_to_snake_case('Innovation & IPR and Centre of Excellence Projects'),
  ratna_type: 'Navratna',
  abbreviation: 'CoE'
).first_or_create!
org_trade_invest = Organization.where(
  ministry_id: min_technology[:id],
  department_id: dept_esdm[:id],
  name: 'Trade and Investment',
  slug: convert_to_snake_case('Trade and Investment'),
  ratna_type: 'Maharatna',
  abbreviation: 'T&I'
).first_or_create!
dept_egov = Department.where(
  ministry_id: min_technology.id,
  name: 'Department of E-Governance',
  slug: convert_to_snake_case('Department of E-Governance')
).first_or_create!
org_aadhaar = Organization.where(
  ministry_id: min_technology[:id],
  department_id: dept_egov[:id],
  name: 'Aadhaar',
  slug: convert_to_snake_case('Aadhaar'),
  ratna_type: 'Navratna',
  abbreviation: 'AADHAAR'
).first_or_create!
org_r_and_d = Organization.where(
  ministry_id: min_technology[:id],
  department_id: dept_egov[:id],
  name: 'Research & Development',
  slug: convert_to_snake_case('Research & Development'),
  ratna_type: 'Navratna',
  abbreviation: 'R&D'
).first_or_create!
dept_cyber_law = Department.where(
  ministry_id: min_technology.id,
  name: 'Department of Cyber Laws',
  slug: convert_to_snake_case('Department of Cyber Laws')
).first_or_create!
org_hdr = Organization.where(
  ministry_id: min_technology[:id],
  department_id: dept_cyber_law[:id],
  name: 'HRD/Knowledge Management',
  slug: convert_to_snake_case('HRD/Knowledge Management'),
  ratna_type: 'Miniratna',
  abbreviation: 'HRD'
).first_or_create!
org_trade_i = Organization.where(
  ministry_id: min_technology[:id],
  department_id: dept_cyber_law[:id],
  name: 'Trade and Investment',
  slug: convert_to_snake_case('Trade and Investment'),
  ratna_type: 'Maharatna',
  abbreviation: 'T&D'
).first_or_create!

min_finance = Ministry.where(
  name: 'Ministry of Finance',
  slug: convert_to_snake_case('Ministry of Finance')
).first_or_create!
dept_eco_aff = Department.where(
  ministry_id: min_finance.id,
  name: 'Department of Economic Affairs',
  slug: convert_to_snake_case('Department of Economic Affairs')
).first_or_create!
org_iifcl = Organization.where(
  ministry_id: min_finance[:id],
  department_id: dept_eco_aff[:id],
  name: 'India Infrastructure Finance Company Limited',
  slug: convert_to_snake_case('India Infrastructure Finance Company Limited'),
  ratna_type: 'Maharatna',
  abbreviation: 'IIFCL'
).first_or_create!
org_oicl = Organization.where(
  ministry_id: min_finance[:id],
  department_id: dept_eco_aff[:id],
  name: 'Oriental Insurance Company Limited',
  slug: convert_to_snake_case('Oriental Insurance Company Limited'),
  ratna_type: 'Navratna',
  abbreviation: 'OICL'
).first_or_create!
org_spmcil = Organization.where(
  ministry_id: min_finance[:id],
  department_id: dept_eco_aff[:id],
  name: 'Security Printing and Minting Corporation of India Limited',
  slug: convert_to_snake_case('Security Printing and Minting Corporation of India Limited'),
  ratna_type: 'Maharatna',
  abbreviation: 'SPMCIL'
).first_or_create!
org_uiicl = Organization.where(
  ministry_id: min_finance[:id],
  department_id: dept_eco_aff[:id],
  name: 'United India Insurance Company Limited',
  slug: convert_to_snake_case('United India Insurance Company Limited'),
  ratna_type: 'Maharatna',
  abbreviation: 'UIICL'
).first_or_create!
dept_expenditure = Department.where(
  ministry_id: min_finance.id,
  name: 'Department of Expenditure',
  slug: convert_to_snake_case('Department of Expenditure')
).first_or_create!
org_expenditure_management = Organization.where(
  ministry_id: min_finance[:id],
  department_id: dept_expenditure[:id],
  name: 'Expenditure Management',
  slug: convert_to_snake_case('Expenditure Management'),
  ratna_type: 'Navratna',
  abbreviation: 'EM'
).first_or_create!
org_economy_measures = Organization.where(
  ministry_id: min_finance[:id],
  department_id: dept_expenditure[:id],
  name: 'Economy Measures',
  slug: convert_to_snake_case('Economy Measures'),
  ratna_type: 'Miniratna',
  abbreviation: 'EM'
).first_or_create!
dept_revenue = Department.where(
  ministry_id: min_finance.id,
  name: 'Department of Revenue',
  slug: convert_to_snake_case('Department of Revenue')
).first_or_create!
org_income_tax = Organization.where(
  ministry_id: min_finance[:id],
  department_id: dept_revenue[:id],
  name: 'Income Tax',
  slug: convert_to_snake_case('Income Tax'),
  ratna_type: 'Miniratna',
  abbreviation: 'IT'
).first_or_create!
org_gst = Organization.where(
  ministry_id: min_finance[:id],
  department_id: dept_revenue[:id],
  name: 'Good and Service Tax',
  slug: convert_to_snake_case('Good and Service Tax'),
  ratna_type: 'Maharatna',
  abbreviation: 'GST'
).first_or_create!
org_vat = Organization.where(
  ministry_id: min_finance[:id],
  department_id: dept_revenue[:id],
  name: 'Value Added Tax',
  slug: convert_to_snake_case('Value Added Tax'),
  ratna_type: 'Navratna',
  abbreviation: 'VAT'
).first_or_create!

min_home_affairs = Ministry.where(
  name: 'Ministry of Home Affairs',
  slug: convert_to_snake_case('Ministry of Home Affairs')
).first_or_create!
dept_border = Department.where(
  ministry_id: min_home_affairs.id,
  name: 'Department of Border Management',
  slug: convert_to_snake_case('Department of Border Management')
).first_or_create!
org_bsf = Organization.where(
  ministry_id: min_home_affairs[:id],
  department_id: dept_border[:id],
  name: 'Border Security Forces',
  slug: convert_to_snake_case('Border Security Forces'),
  ratna_type: 'Navratna',
  abbreviation: 'ED'
).first_or_create!
org_cisf = Organization.where(
  ministry_id: min_home_affairs[:id],
  department_id: dept_border[:id],
  name: 'Central Industrial Security Force',
  slug: convert_to_snake_case('Central Industrial Security Force'),
  ratna_type: 'Navratna',
  abbreviation: 'CISF'
).first_or_create!
org_crpf = Organization.where(
  ministry_id: min_home_affairs[:id],
  department_id: dept_border[:id],
  name: 'Central Reserved Police Force',
  slug: convert_to_snake_case('Central Reserved Police Force'),
  ratna_type: 'Navratna',
  abbreviation: 'CRPF'
).first_or_create!
dept_internal_security = Department.where(
  ministry_id: min_home_affairs.id,
  name: 'Department of Internal Security',
  slug: convert_to_snake_case('Department of Internal Security')
).first_or_create!
org_ed = Organization.where(
  ministry_id: min_home_affairs[:id],
  department_id: dept_internal_security[:id],
  name: 'Enforcement Directorate',
  slug: convert_to_snake_case('Enforcement Directorate'),
  ratna_type: 'Navratna',
  abbreviation: 'ED'
).first_or_create!
org_cbi = Organization.where(
  ministry_id: min_home_affairs[:id],
  department_id: dept_internal_security[:id],
  name: 'Central Bureau of Investigation',
  slug: convert_to_snake_case('Central Bureau of Investigation'),
  ratna_type: 'Navratna',
  abbreviation: 'CBI'
).first_or_create!

min_labour = Ministry.where(
  name: 'Ministry of Labour',
  slug: convert_to_snake_case('Ministry of Labour')
).first_or_create!
dept_labour = Department.where(
  ministry_id: min_labour.id,
  name: 'Department of Labour',
  slug: convert_to_snake_case('Department of Labour')
).first_or_create!
org_ncs = Organization.where(
  ministry_id: min_labour[:id],
  department_id: dept_labour[:id],
  name: 'National Career Service',
  slug: convert_to_snake_case('National Career Service'),
  ratna_type: 'Miniratna',
  abbreviation: 'NCS'
).first_or_create!
org_ussp = Organization.where(
  ministry_id: min_labour[:id],
  department_id: dept_labour[:id],
  name: 'Unified Shram Suvidha Portal',
  slug: convert_to_snake_case('Unified Shram Suvidha Portal'),
  ratna_type: 'Miniratna',
  abbreviation: 'USSP'
).first_or_create!

min_coal_petroleum = Ministry.where(
  name: 'Ministry of Coal & Petroleum',
  slug: convert_to_snake_case('Ministry of Coal & Petroleum')
).first_or_create!
dept_coal = Department.where(
  ministry_id: min_coal_petroleum.id,
  name: 'Department of Coal',
  slug: convert_to_snake_case('Department of Coal')
).first_or_create!
org_bccl = Organization.where(
  ministry_id: min_coal_petroleum[:id],
  department_id: dept_coal[:id],
  name: 'Bharat Coking Coal Limited',
  slug: convert_to_snake_case('Bharat Coking Coal Limited'),
  ratna_type: 'Miniratna',
  abbreviation: 'BCCL'
).first_or_create!
org_ccl = Organization.where(
  ministry_id: min_coal_petroleum[:id],
  department_id: dept_coal[:id],
  name: 'Central Coalfields Limited',
  slug: convert_to_snake_case('Central Coalfields Limited'),
  ratna_type: 'Maharatna',
  abbreviation: 'CCL'
).first_or_create!
org_ecl = Organization.where(
  ministry_id: min_coal_petroleum[:id],
  department_id: dept_coal[:id],
  name: 'Eastern Coalfields Limited',
  slug: convert_to_snake_case('Eastern Coalfields Limited'),
  ratna_type: 'Navratna',
  abbreviation: 'ECL'
).first_or_create!
org_wcl = Organization.where(
  ministry_id: min_coal_petroleum[:id],
  department_id: dept_coal[:id],
  name: 'Western Coalfields Limited',
  slug: convert_to_snake_case('Western Coalfields Limited'),
  ratna_type: 'Miniratna',
  abbreviation: 'WCL'
).first_or_create!
org_secl = Organization.where(
  ministry_id: min_coal_petroleum[:id],
  department_id: dept_coal[:id],
  name: 'South Eastern Coalfields Limited',
  slug: convert_to_snake_case('South Eastern Coalfields Limited'),
  ratna_type: 'Miniratna',
  abbreviation: 'SECL'
).first_or_create!
org_ncl = Organization.where(
  ministry_id: min_coal_petroleum[:id],
  department_id: dept_coal[:id],
  name: 'Northern Coalfields Limited',
  slug: convert_to_snake_case('Northern Coalfields Limited'),
  ratna_type: 'Maharatna',
  abbreviation: 'NCL'
).first_or_create!
org_cmpdi = Organization.where(
  ministry_id: min_coal_petroleum[:id],
  department_id: dept_coal[:id],
  name: 'Central Mine Planning and Design Institute',
  slug: convert_to_snake_case('Central Mine Planning and Design Institute'),
  ratna_type: 'Navratna',
  abbreviation: 'CMPDI'
).first_or_create!
org_mcl = Organization.where(
  ministry_id: min_coal_petroleum[:id],
  department_id: dept_coal[:id],
  name: 'Mahanadi Coalfields Limited',
  slug: convert_to_snake_case('Mahanadi Coalfields Limited'),
  ratna_type: 'Navratna',
  abbreviation: 'MCL'
).first_or_create!
dept_petroleum = Department.where(
  ministry_id: min_coal_petroleum.id,
  name: 'Department of Petroleum',
  slug: convert_to_snake_case('Department of Petroleum')
).first_or_create!
org_ongc = Organization.where(
  ministry_id: min_coal_petroleum[:id],
  department_id: dept_petroleum[:id],
  name: 'Oil and Natural Gas Corporation Limited',
  slug: convert_to_snake_case('Oil and Natural Gas Corporation Limited'),
  ratna_type: 'Navratna',
  abbreviation: 'ONGC'
).first_or_create!
org_bpcl = Organization.where(
  ministry_id: min_coal_petroleum[:id],
  department_id: dept_petroleum[:id],
  name: 'Bharat Petroleum Corporation Limited',
  slug: convert_to_snake_case('Bharat Petroleum Corporation Limited'),
  ratna_type: 'Navratna',
  abbreviation: 'BPCL'
).first_or_create!
org_iocl = Organization.where(
  ministry_id: min_coal_petroleum[:id],
  department_id: dept_petroleum[:id],
  name: 'Indian Oil Corporation Limited',
  slug: convert_to_snake_case('Indian Oil Corporation Limited'),
  ratna_type: 'Miniratna',
  abbreviation: 'IOCL'
).first_or_create!
org_hp = Organization.where(
  ministry_id: min_coal_petroleum[:id],
  department_id: dept_petroleum[:id],
  name: 'Hindustan Petroleum',
  slug: convert_to_snake_case('Hindustan Petroleum'),
  ratna_type: 'Navratna',
  abbreviation: 'HP'
).first_or_create!

min_health = Ministry.where(
  name: 'Ministry of Health',
  slug: convert_to_snake_case('Ministry of Health')
).first_or_create!
dept_health = Department.where(
  ministry_id: min_health.id,
  name: 'Department of Health Research',
  slug: convert_to_snake_case('Department of Health Research')
).first_or_create!
org_nihfw = Organization.where(
  ministry_id: min_health[:id],
  department_id: dept_health[:id],
  name: 'National Institute of Health and Family Welfare',
  slug: convert_to_snake_case('National Institute of Health and Family Welfare'),
  ratna_type: 'Navratna',
  abbreviation: 'NIHFW'
).first_or_create!
org_iips = Organization.where(
  ministry_id: min_health[:id],
  department_id: dept_health[:id],
  name: 'International Institute for Population Sciences',
  slug: convert_to_snake_case('International Institute for Population Sciences'),
  ratna_type: 'Navratna',
  abbreviation: 'IIPS'
).first_or_create!
org_cdri = Organization.where(
  ministry_id: min_health[:id],
  department_id: dept_health[:id],
  name: 'Central Drug Research Institute',
  slug: convert_to_snake_case('Central Drug Research Institute'),
  ratna_type: 'Navratna',
  abbreviation: 'CDRI'
).first_or_create!
dept_hfw = Department.where(
  ministry_id: min_health.id,
  name: 'Department of Health and Family Welfare',
  slug: convert_to_snake_case('Department of Health and Family Welfare')
).first_or_create!
org_hscc = Organization.where(
  ministry_id: min_health[:id],
  department_id: dept_hfw[:id],
  name: 'Hospital Services Consultancy Corporation Limited',
  slug: convert_to_snake_case('Hospital Services Consultancy Corporation Limited'),
  ratna_type: 'Miniratna',
  abbreviation: 'HSCC'
).first_or_create!
org_cdcso = Organization.where(
  ministry_id: min_health[:id],
  department_id: dept_hfw[:id],
  name: 'Central Drugs Standard Control Organization',
  slug: convert_to_snake_case('Central Drugs Standard Control Organization'),
  ratna_type: 'Navratna',
  abbreviation: 'CDSCO'
).first_or_create!
org_hll = Organization.where(
  ministry_id: min_health[:id],
  department_id: dept_hfw[:id],
  name: 'Lifecare Limited',
  slug: convert_to_snake_case('Lifecare Limited'),
  ratna_type: 'Navratna',
  abbreviation: 'HLL'
).first_or_create!





