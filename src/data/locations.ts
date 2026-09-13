export interface DistrictData {
  district: string;
  upazilas: string[];
}

export interface DivisionData {
  division: string;
  districts: DistrictData[];
}

export const bdLocations: DivisionData[] = [
  {
    division: "Dhaka",
    districts: [
      {
        district: "Dhaka",
        upazilas: [
          "Dhamrai",
          "Dohar",
          "Keraniganj",
          "Nawabganj",
          "Savar",
          "Tejgaon Circle",
          "Mirpur",
          "Gulshan",
          "Mohammadpur",
          "Dhanmondi",
          "Badda",
          "Uttara",
          "Jatrabari"
        ]
      },
      {
        district: "Gazipur",
        upazilas: ["Gazipur Sadar", "Kaliakair", "Kaliganj", "Kapasia", "Sreepur"]
      },
      {
        district: "Narayanganj",
        upazilas: ["Araihazar", "Bandar", "Narayanganj Sadar", "Rupganj", "Sonargaon"]
      },
      {
        district: "Tangail",
        upazilas: [
          "Basail",
          "Bhuapur",
          "Delduar",
          "Dhanbari",
          "Ghatail",
          "Gopalpur",
          "Kalihati",
          "Madhupur",
          "Mirzapur",
          "Nagarpur",
          "Sakhipur",
          "Tangail Sadar"
        ]
      },
      {
        district: "Kishoreganj",
        upazilas: [
          "Austagram",
          "Bajitpur",
          "Bhairab",
          "Hossainpur",
          "Itna",
          "Karimganj",
          "Katiadi",
          "Kishoreganj Sadar",
          "Kuliarchar",
          "Mithamain",
          "Nikli",
          "Pakundia",
          "Tarail"
        ]
      },
      {
        district: "Manikganj",
        upazilas: [
          "Daulatpur",
          "Ghior",
          "Harirampur",
          "Manikganj Sadar",
          "Saturia",
          "Shibalaya",
          "Singair"
        ]
      },
      {
        district: "Munshiganj",
        upazilas: [
          "Gazaria",
          "Lohajang",
          "Munshiganj Sadar",
          "Sirajdikhan",
          "Sreenagar",
          "Tongibari"
        ]
      },
      {
        district: "Narsingdi",
        upazilas: [
          "Belabo",
          "Monohardi",
          "Narsingdi Sadar",
          "Palash",
          "Raipura",
          "Shibpur"
        ]
      },
      {
        district: "Faridpur",
        upazilas: [
          "Alfadanga",
          "Bhanga",
          "Boalmari",
          "Charbhadrasan",
          "Faridpur Sadar",
          "Madhukhali",
          "Nagarkanda",
          "Sadarpur",
          "Saltha"
        ]
      },
      {
        district: "Gopalganj",
        upazilas: [
          "Gopalganj Sadar",
          "Kashiani",
          "Kotalipara",
          "Muksudpur",
          "Tungipara"
        ]
      },
      {
        district: "Madaripur",
        upazilas: [
          "Barhamganj",
          "Kalkini",
          "Madaripur Sadar",
          "Rajoir",
          "Shibchar"
        ]
      },
      {
        district: "Rajbari",
        upazilas: [
          "Baliakandi",
          "Goalandaghat",
          "Kalukhali",
          "Pangsha",
          "Rajbari Sadar"
        ]
      },
      {
        district: "Shariatpur",
        upazilas: [
          "Bhedarganj",
          "Damudya",
          "Gosairhat",
          "Naria",
          "Shariatpur Sadar",
          "Zajira"
        ]
      }
    ]
  },
  {
    division: "Chattogram",
    districts: [
      {
        district: "Chattogram",
        upazilas: [
          "Anwara",
          "Banshkhali",
          "Boalkhali",
          "Chandanaish",
          "Fatikchhari",
          "Hathazari",
          "Karnafuli",
          "Lohagara",
          "Mirsharai",
          "Patiya",
          "Rangunia",
          "Raozan",
          "Sandwip",
          "Satkania",
          "Sitakunda"
        ]
      },
      {
        district: "Cox's Bazar",
        upazilas: [
          "Chakaria",
          "Cox's Bazar Sadar",
          "Eidgaon",
          "Kutubdia",
          "Maheshkhali",
          "Pekua",
          "Ramu",
          "Teknaf",
          "Ukhia"
        ]
      },
      {
        district: "Cumilla",
        upazilas: [
          "Barura",
          "Brahmanpara",
          "Burichang",
          "Chandina",
          "Chauddagram",
          "Cumilla Adarsha Sadar",
          "Cumilla Sadar Dakshin",
          "Daudkandi",
          "Debidwar",
          "Homna",
          "Laksam",
          "Lalmai",
          "Meghna",
          "Monohargonj",
          "Muradnagar",
          "Nangalkot",
          "Titas"
        ]
      },
      {
        district: "Brahmanbaria",
        upazilas: [
          "Akhaura",
          "Ashuganj",
          "Bancharampur",
          "Bijoynagar",
          "Brahmanbaria Sadar",
          "Kasba",
          "Nabinagar",
          "Nasirnagar",
          "Sarail"
        ]
      },
      {
        district: "Chandpur",
        upazilas: [
          "Chandpur Sadar",
          "Faridganj",
          "Haimchar",
          "Haziganj",
          "Kachua",
          "Matlab Dakshin",
          "Matlab Uttar",
          "Shahrasti"
        ]
      },
      {
        district: "Noakhali",
        upazilas: [
          "Begumganj",
          "Chatkhil",
          "Companiganj",
          "Hatiya",
          "Kabirhat",
          "Noakhali Sadar",
          "Senbagh",
          "Sonaimuri",
          "Subarnachar"
        ]
      },
      {
        district: "Feni",
        upazilas: [
          "Chhagalnaiya",
          "Daganbhuiyan",
          "Feni Sadar",
          "Fulgazi",
          "Parshuram",
          "Sonagazi"
        ]
      },
      {
        district: "Lakshmipur",
        upazilas: [
          "Kamalnagar",
          "Lakshmipur Sadar",
          "Raipur",
          "Ramganj",
          "Ramgati"
        ]
      },
      {
        district: "Khagrachhari",
        upazilas: [
          "Dighinala",
          "Guimara",
          "Khagrachhari Sadar",
          "Lakshmichhari",
          "Mahalchhari",
          "Manikchhari",
          "Matiranga",
          "Panchhari",
          "Ramgarh"
        ]
      },
      {
        district: "Rangamati",
        upazilas: [
          "Bagaichhari",
          "Barkal",
          "Belaichhari",
          "Juraichhari",
          "Kaptai",
          "Kawkhali",
          "Langadu",
          "Naniarchar",
          "Rajasthali",
          "Rangamati Sadar"
        ]
      },
      {
        district: "Bandarban",
        upazilas: [
          "Ali Kadam",
          "Bandarban Sadar",
          "Lama",
          "Naikhongchhari",
          "Rowangchhari",
          "Ruma",
          "Thanchi"
        ]
      }
    ]
  },
  {
    division: "Rajshahi",
    districts: [
      {
        district: "Rajshahi",
        upazilas: [
          "Bagha",
          "Baghmara",
          "Charghat",
          "Durgapur",
          "Godagari",
          "Mohanpur",
          "Paba",
          "Puthia",
          "Tanore"
        ]
      },
      {
        district: "Bogura",
        upazilas: [
          "Adamdighi",
          "Bogura Sadar",
          "Dhunat",
          "Dhupchanchia",
          "Gabtali",
          "Kahaloo",
          "Nandigram",
          "Sariakandi",
          "Shajahanpur",
          "Sherpur",
          "Shibganj",
          "Sonatala"
        ]
      },
      {
        district: "Pabna",
        upazilas: [
          "Atgharia",
          "Bera",
          "Bhangura",
          "Chatmohar",
          "Faridpur",
          "Ishwardi",
          "Pabna Sadar",
          "Santhia",
          "Sujanagar"
        ]
      },
      {
        district: "Sirajganj",
        upazilas: [
          "Belkuchi",
          "Chauhali",
          "Kamarkhanda",
          "Kazipur",
          "Raiganj",
          "Shahjadpur",
          "Sirajganj Sadar",
          "Tarash",
          "Ullahpara"
        ]
      },
      {
        district: "Naogaon",
        upazilas: [
          "Atrai",
          "Badalgachhi",
          "Dhamoirhat",
          "Manda",
          "Mohadevpur",
          "Naogaon Sadar",
          "Niamatpur",
          "Patnitala",
          "Porsha",
          "Raninagar",
          "Sapahar"
        ]
      },
      {
        district: "Natore",
        upazilas: [
          "Bagatipara",
          "Baraigram",
          "Gurudaspur",
          "Lalpur",
          "Naldanga",
          "Natore Sadar",
          "Singra"
        ]
      },
      {
        district: "Chapai Nawabganj",
        upazilas: [
          "Bholahat",
          "Gomastapur",
          "Nachole",
          "Nawabganj Sadar",
          "Shibganj"
        ]
      },
      {
        district: "Joypurhat",
        upazilas: [
          "Akkelpur",
          "Joypurhat Sadar",
          "Kalai",
          "Khetlal",
          "Panchbibi"
        ]
      }
    ]
  },
  {
    division: "Khulna",
    districts: [
      {
        district: "Khulna",
        upazilas: [
          "Batiaghata",
          "Dacope",
          "Dighalia",
          "Dumuria",
          "Koyra",
          "Paikgachha",
          "Phultala",
          "Rupsha",
          "Terokhada"
        ]
      },
      {
        district: "Jashore",
        upazilas: [
          "Abhaynagar",
          "Bagherpara",
          "Chaugachha",
          "Jhikargachha",
          "Keshabpur",
          "Jashore Sadar",
          "Manirampur",
          "Sharsha"
        ]
      },
      {
        district: "Kushtia",
        upazilas: [
          "Bheramara",
          "Daulatpur",
          "Khoksa",
          "Kumarkhali",
          "Kushtia Sadar",
          "Mirpur"
        ]
      },
      {
        district: "Jhenaidah",
        upazilas: [
          "Harinakunda",
          "Jhenaidah Sadar",
          "Kaliganj",
          "Kotchandpur",
          "Maheshpur",
          "Shailkupa"
        ]
      },
      {
        district: "Bagerhat",
        upazilas: [
          "Bagerhat Sadar",
          "Chitalmari",
          "Fakirhat",
          "Kachua",
          "Mollahat",
          "Mongla",
          "Morrelganj",
          "Rampal",
          "Sarankhola"
        ]
      },
      {
        district: "Satkhira",
        upazilas: [
          "Assasuni",
          "Debhata",
          "Kalaroa",
          "Kaliganj",
          "Satkhira Sadar",
          "Shyamnagar",
          "Tala"
        ]
      },
      {
        district: "Chuadanga",
        upazilas: [
          "Alamdanga",
          "Chuadanga Sadar",
          "Damurhuda",
          "Jibannagar"
        ]
      },
      {
        district: "Meherpur",
        upazilas: [
          "Gangni",
          "Meherpur Sadar",
          "Mujibnagar"
        ]
      },
      {
        district: "Narail",
        upazilas: [
          "Kalia",
          "Lohagara",
          "Narail Sadar"
        ]
      },
      {
        district: "Magura",
        upazilas: [
          "Magura Sadar",
          "Mohammadpur",
          "Shalikha",
          "Sreepur"
        ]
      }
    ]
  },
  {
    division: "Barishal",
    districts: [
      {
        district: "Barishal",
        upazilas: [
          "Agailjhara",
          "Babuganj",
          "Bakerganj",
          "Banaripara",
          "Gaurnadi",
          "Hizla",
          "Barishal Sadar",
          "Mehendiganj",
          "Muladi",
          "Wazirpur"
        ]
      },
      {
        district: "Patuakhali",
        upazilas: [
          "Bauphal",
          "Dashmina",
          "Dumki",
          "Galachipa",
          "Kalapara",
          "Mirzaganj",
          "Patuakhali Sadar",
          "Rangabali"
        ]
      },
      {
        district: "Bhola",
        upazilas: [
          "Bhola Sadar",
          "Burhanuddin",
          "Char Fasson",
          "Daulatkhan",
          "Lalmohan",
          "Manpura",
          "Tazumuddin"
        ]
      },
      {
        district: "Pirojpur",
        upazilas: [
          "Bhandaria",
          "Indurkani",
          "Kawkhali",
          "Mathbaria",
          "Nazirpur",
          "Nesarabad (Swarupkati)",
          "Pirojpur Sadar"
        ]
      },
      {
        district: "Barguna",
        upazilas: [
          "Amtali",
          "Bamna",
          "Barguna Sadar",
          "Betagi",
          "Patharghata",
          "Taltali"
        ]
      },
      {
        district: "Jhalokati",
        upazilas: [
          "Jhalokati Sadar",
          "Kathalia",
          "Nalchhiti",
          "Rajapur"
        ]
      }
    ]
  },
  {
    division: "Sylhet",
    districts: [
      {
        district: "Sylhet",
        upazilas: [
          "Balaganj",
          "Beanibazar",
          "Bishwanath",
          "Companiganj",
          "Dakshin Surma",
          "Fenchuganj",
          "Golapganj",
          "Gowainghat",
          "Jaintiapur",
          "Kanaighat",
          "Osmani Nagar",
          "Sylhet Sadar",
          "Zakiganj"
        ]
      },
      {
        district: "Habiganj",
        upazilas: [
          "Ajmiriganj",
          "Bahubal",
          "Baniyachong",
          "Chunarughat",
          "Habiganj Sadar",
          "Lakhai",
          "Madhabpur",
          "Nabiganj",
          "Sayestaganj"
        ]
      },
      {
        district: "Moulvibazar",
        upazilas: [
          "Barlekha",
          "Juri",
          "Kamalganj",
          "Kulaura",
          "Moulvibazar Sadar",
          "Rajnagar",
          "Sreemangal"
        ]
      },
      {
        district: "Sunamganj",
        upazilas: [
          "Bishwamvarpur",
          "Chhatak",
          "Dakshin Sunamganj (Shantiganj)",
          "Derai",
          "Dharampasha",
          "Dowarabazar",
          "Jagannathpur",
          "Jamalganj",
          "Madhyanagar",
          "Sullah",
          "Sunamganj Sadar",
          "Tahirpur"
        ]
      }
    ]
  },
  {
    division: "Rangpur",
    districts: [
      {
        district: "Rangpur",
        upazilas: [
          "Badarganj",
          "Gangachhara",
          "Kaunia",
          "Mithapukur",
          "Pirgachha",
          "Pirganj",
          "Rangpur Sadar",
          "Taraganj"
        ]
      },
      {
        district: "Dinajpur",
        upazilas: [
          "Birampur",
          "Birganj",
          "Biral",
          "Bochaganj",
          "Chirirbandar",
          "Dinajpur Sadar",
          "Fulbari",
          "Ghoraghat",
          "Hakimpur",
          "Kaharole",
          "Khansama",
          "Nawabganj",
          "Parbatipur"
        ]
      },
      {
        district: "Gaibandha",
        upazilas: [
          "Fulchhari",
          "Gaibandha Sadar",
          "Gobindaganj",
          "Palashbari",
          "Sadullapur",
          "Saghata",
          "Sundarganj"
        ]
      },
      {
        district: "Kurigram",
        upazilas: [
          "Bhurungamari",
          "Char Rajibpur",
          "Chilmari",
          "Kurigram Sadar",
          "Nageshwari",
          "Phulbari",
          "Rajarhat",
          "Raomari",
          "Ulipur"
        ]
      },
      {
        district: "Nilphamari",
        upazilas: [
          "Dimla",
          "Domar",
          "Jaldhaka",
          "Kishoreganj",
          "Nilphamari Sadar",
          "Saidpur"
        ]
      },
      {
        district: "Lalmonirhat",
        upazilas: [
          "Aditmari",
          "Hatibandha",
          "Kaliganj",
          "Lalmonirhat Sadar",
          "Patgram"
        ]
      },
      {
        district: "Panchagarh",
        upazilas: [
          "Atwari",
          "Boda",
          "Debiganj",
          "Panchagarh Sadar",
          "Tetulia"
        ]
      },
      {
        district: "Thakurgaon",
        upazilas: [
          "Baliadangi",
          "Haripur",
          "Pirganj",
          "Ranisankail",
          "Thakurgaon Sadar"
        ]
      }
    ]
  },
  {
    division: "Mymensingh",
    districts: [
      {
        district: "Mymensingh",
        upazilas: [
          "Bhaluka",
          "Dhobaura",
          "Fulbaria",
          "Gaffargaon",
          "Gauripur",
          "Haluaghat",
          "Ishwarganj",
          "Mymensingh Sadar",
          "Muktagachha",
          "Nandail",
          "Phulpur",
          "Tara Khanda",
          "Trishal"
        ]
      },
      {
        district: "Jamalpur",
        upazilas: [
          "Bakshiganj",
          "Dewanganj",
          "Islampur",
          "Jamalpur Sadar",
          "Madarganj",
          "Melandaha",
          "Sarishabari"
        ]
      },
      {
        district: "Netrokona",
        upazilas: [
          "Atpara",
          "Barhatta",
          "Durgapur",
          "Kalmakanda",
          "Kendua",
          "Madan",
          "Mohanganj",
          "Netrokona Sadar",
          "Purbadhala",
          "Khaliajuri"
        ]
      },
      {
        district: "Sherpur",
        upazilas: [
          "Jhenaigati",
          "Nakla",
          "Nalitabari",
          "Sherpur Sadar",
          "Sreebardi"
        ]
      }
    ]
  }
];