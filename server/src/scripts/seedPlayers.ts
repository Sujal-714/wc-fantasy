import { Pool } from 'pg'
import { config } from '../config'


const pool = new Pool({
  connectionString: config.database_url,
})

// ─── TYPES ──────────────────────────────────────────────────
type Position = 'GK' | 'DEF' | 'MID' | 'FWD'

interface Player {
  api_player_id: number
  name: string
  position: Position
  country: string
  price: number
  image_url?: string
}

// ─── PLAYER DATA ────────────────────────────────────────────
// 32 WC 2026 countries, ~4 players each = 128 players
// Prices reflect fantasy value: stars = expensive, squad players = cheap
// api_player_id is mocked (1000+) — replace with real IDs from API-Football later

const players: Player[] = [
  // ── BRAZIL ──────────────────────────────────────────────
  { api_player_id: 1001, name: 'Alisson',         position: 'GK',  country: 'Brazil',      price: 9.5 },
  { api_player_id: 1002, name: 'Marquinhos',      position: 'DEF', country: 'Brazil',      price: 8.0 },
  { api_player_id: 1003, name: 'Vinicius Jr',     position: 'FWD', country: 'Brazil',      price: 13.0 },
  { api_player_id: 1004, name: 'Rodrygo',         position: 'FWD', country: 'Brazil',      price: 10.5 },
  { api_player_id: 1005, name: 'Casemiro',        position: 'MID', country: 'Brazil',      price: 8.5 },

  // ── ARGENTINA ───────────────────────────────────────────
  { api_player_id: 1006, name: 'Emiliano Martinez', position: 'GK',  country: 'Argentina',  price: 10.0 },
  { api_player_id: 1007, name: 'Nicolas Otamendi',  position: 'DEF', country: 'Argentina',  price: 7.0 },
  { api_player_id: 1008, name: 'Lionel Messi',      position: 'FWD', country: 'Argentina',  price: 15.0 },
  { api_player_id: 1009, name: 'Julian Alvarez',    position: 'FWD', country: 'Argentina',  price: 11.0 },
  { api_player_id: 1010, name: 'Rodrigo De Paul',   position: 'MID', country: 'Argentina',  price: 8.0 },

  // ── FRANCE ──────────────────────────────────────────────
  { api_player_id: 1011, name: 'Mike Maignan',    position: 'GK',  country: 'France',      price: 9.0 },
  { api_player_id: 1012, name: 'Theo Hernandez',  position: 'DEF', country: 'France',      price: 8.5 },
  { api_player_id: 1013, name: 'Kylian Mbappe',   position: 'FWD', country: 'France',      price: 14.5 },
  { api_player_id: 1014, name: 'Antoine Griezmann',position: 'MID', country: 'France',      price: 11.0 },
  { api_player_id: 1015, name: 'Aurelien Tchouameni', position: 'MID', country: 'France',   price: 8.0 },

  // ── ENGLAND ─────────────────────────────────────────────
  { api_player_id: 1016, name: 'Jordan Pickford', position: 'GK',  country: 'England',     price: 8.5 },
  { api_player_id: 1017, name: 'Kyle Walker',     position: 'DEF', country: 'England',     price: 7.5 },
  { api_player_id: 1018, name: 'Harry Kane',      position: 'FWD', country: 'England',     price: 13.5 },
  { api_player_id: 1019, name: 'Jude Bellingham', position: 'MID', country: 'England',     price: 13.0 },
  { api_player_id: 1020, name: 'Phil Foden',      position: 'MID', country: 'England',     price: 11.0 },

  // ── SPAIN ───────────────────────────────────────────────
  { api_player_id: 1021, name: 'Unai Simon',      position: 'GK',  country: 'Spain',       price: 8.0 },
  { api_player_id: 1022, name: 'Dani Carvajal',   position: 'DEF', country: 'Spain',       price: 7.5 },
  { api_player_id: 1023, name: 'Alvaro Morata',   position: 'FWD', country: 'Spain',       price: 9.5 },
  { api_player_id: 1024, name: 'Pedri',           position: 'MID', country: 'Spain',       price: 11.5 },
  { api_player_id: 1025, name: 'Rodri',           position: 'MID', country: 'Spain',       price: 10.5 },

  // ── PORTUGAL ────────────────────────────────────────────
  { api_player_id: 1026, name: 'Diogo Costa',     position: 'GK',  country: 'Portugal',    price: 8.5 },
  { api_player_id: 1027, name: 'Ruben Dias',      position: 'DEF', country: 'Portugal',    price: 8.5 },
  { api_player_id: 1028, name: 'Cristiano Ronaldo',position: 'FWD', country: 'Portugal',   price: 12.0 },
  { api_player_id: 1029, name: 'Bruno Fernandes', position: 'MID', country: 'Portugal',    price: 11.5 },
  { api_player_id: 1030, name: 'Bernardo Silva',  position: 'MID', country: 'Portugal',    price: 10.0 },

  // ── GERMANY ─────────────────────────────────────────────
  { api_player_id: 1031, name: 'Manuel Neuer',    position: 'GK',  country: 'Germany',     price: 8.5 },
  { api_player_id: 1032, name: 'Antonio Rudiger', position: 'DEF', country: 'Germany',     price: 7.5 },
  { api_player_id: 1033, name: 'Kai Havertz',     position: 'FWD', country: 'Germany',     price: 10.0 },
  { api_player_id: 1034, name: 'Jamal Musiala',   position: 'MID', country: 'Germany',     price: 12.0 },
  { api_player_id: 1035, name: 'Florian Wirtz',   position: 'MID', country: 'Germany',     price: 11.5 },

  // ── NETHERLANDS ─────────────────────────────────────────
  { api_player_id: 1036, name: 'Bart Verbruggen', position: 'GK',  country: 'Netherlands', price: 7.5 },
  { api_player_id: 1037, name: 'Virgil van Dijk', position: 'DEF', country: 'Netherlands', price: 9.0 },
  { api_player_id: 1038, name: 'Memphis Depay',   position: 'FWD', country: 'Netherlands', price: 9.0 },
  { api_player_id: 1039, name: 'Xavi Simons',     position: 'MID', country: 'Netherlands', price: 10.5 },
  { api_player_id: 1040, name: 'Frenkie de Jong', position: 'MID', country: 'Netherlands', price: 9.5 },

  // ── BELGIUM ─────────────────────────────────────────────
  { api_player_id: 1041, name: 'Koen Casteels',   position: 'GK',  country: 'Belgium',     price: 7.0 },
  { api_player_id: 1042, name: 'Jan Vertonghen',  position: 'DEF', country: 'Belgium',     price: 6.5 },
  { api_player_id: 1043, name: 'Romelu Lukaku',   position: 'FWD', country: 'Belgium',     price: 10.0 },
  { api_player_id: 1044, name: 'Kevin De Bruyne', position: 'MID', country: 'Belgium',     price: 12.5 },
  { api_player_id: 1045, name: 'Youri Tielemans', position: 'MID', country: 'Belgium',     price: 8.0 },

  // ── CROATIA ─────────────────────────────────────────────
  { api_player_id: 1046, name: 'Dominik Livakovic',position: 'GK',  country: 'Croatia',    price: 8.0 },
  { api_player_id: 1047, name: 'Josko Gvardiol',  position: 'DEF', country: 'Croatia',     price: 9.0 },
  { api_player_id: 1048, name: 'Andrej Kramaric', position: 'FWD', country: 'Croatia',     price: 8.5 },
  { api_player_id: 1049, name: 'Luka Modric',     position: 'MID', country: 'Croatia',     price: 9.5 },
  { api_player_id: 1050, name: 'Mateo Kovacic',   position: 'MID', country: 'Croatia',     price: 8.5 },

  // ── URUGUAY ─────────────────────────────────────────────
  { api_player_id: 1051, name: 'Sergio Rochet',   position: 'GK',  country: 'Uruguay',     price: 6.5 },
  { api_player_id: 1052, name: 'Jose Gimenez',    position: 'DEF', country: 'Uruguay',     price: 7.0 },
  { api_player_id: 1053, name: 'Darwin Nunez',    position: 'FWD', country: 'Uruguay',     price: 11.0 },
  { api_player_id: 1054, name: 'Federico Valverde',position: 'MID', country: 'Uruguay',    price: 10.5 },
  { api_player_id: 1055, name: 'Rodrigo Bentancur',position: 'MID', country: 'Uruguay',    price: 8.0 },

  // ── COLOMBIA ────────────────────────────────────────────
  { api_player_id: 1056, name: 'Camilo Vargas',   position: 'GK',  country: 'Colombia',    price: 6.5 },
  { api_player_id: 1057, name: 'Davinson Sanchez', position: 'DEF', country: 'Colombia',   price: 7.0 },
  { api_player_id: 1058, name: 'Radamel Falcao',  position: 'FWD', country: 'Colombia',    price: 7.5 },
  { api_player_id: 1059, name: 'James Rodriguez', position: 'MID', country: 'Colombia',    price: 9.0 },
  { api_player_id: 1060, name: 'Luis Diaz',       position: 'FWD', country: 'Colombia',    price: 10.5 },

  // ── USA ─────────────────────────────────────────────────
  { api_player_id: 1061, name: 'Matt Turner',     position: 'GK',  country: 'USA',         price: 6.0 },
  { api_player_id: 1062, name: 'Sergino Dest',    position: 'DEF', country: 'USA',         price: 6.5 },
  { api_player_id: 1063, name: 'Ricardo Pepi',    position: 'FWD', country: 'USA',         price: 7.5 },
  { api_player_id: 1064, name: 'Christian Pulisic',position: 'MID', country: 'USA',        price: 10.0 },
  { api_player_id: 1065, name: 'Weston McKennie', position: 'MID', country: 'USA',         price: 7.5 },

  // ── MEXICO ──────────────────────────────────────────────
  { api_player_id: 1066, name: 'Guillermo Ochoa', position: 'GK',  country: 'Mexico',      price: 7.0 },
  { api_player_id: 1067, name: 'Cesar Montes',    position: 'DEF', country: 'Mexico',      price: 6.0 },
  { api_player_id: 1068, name: 'Raul Jimenez',    position: 'FWD', country: 'Mexico',      price: 8.5 },
  { api_player_id: 1069, name: 'Hirving Lozano',  position: 'MID', country: 'Mexico',      price: 8.0 },
  { api_player_id: 1070, name: 'Edson Alvarez',   position: 'MID', country: 'Mexico',      price: 7.5 },

  // ── SENEGAL ─────────────────────────────────────────────
  { api_player_id: 1071, name: 'Edouard Mendy',   position: 'GK',  country: 'Senegal',     price: 7.5 },
  { api_player_id: 1072, name: 'Kalidou Koulibaly',position: 'DEF', country: 'Senegal',    price: 8.0 },
  { api_player_id: 1073, name: 'Boulaye Dia',     position: 'FWD', country: 'Senegal',     price: 7.5 },
  { api_player_id: 1074, name: 'Sadio Mane',      position: 'FWD', country: 'Senegal',     price: 11.0 },
  { api_player_id: 1075, name: 'Idrissa Gueye',   position: 'MID', country: 'Senegal',     price: 7.0 },

  // ── MOROCCO ─────────────────────────────────────────────
  { api_player_id: 1076, name: 'Yassine Bounou',  position: 'GK',  country: 'Morocco',     price: 8.5 },
  { api_player_id: 1077, name: 'Achraf Hakimi',   position: 'DEF', country: 'Morocco',     price: 9.5 },
  { api_player_id: 1078, name: 'Youssef En-Nesyri',position: 'FWD', country: 'Morocco',    price: 9.0 },
  { api_player_id: 1079, name: 'Hakim Ziyech',    position: 'MID', country: 'Morocco',     price: 9.0 },
  { api_player_id: 1080, name: 'Sofyan Amrabat',  position: 'MID', country: 'Morocco',     price: 8.0 },

  // ── JAPAN ───────────────────────────────────────────────
  { api_player_id: 1081, name: 'Shuichi Gonda',   position: 'GK',  country: 'Japan',       price: 6.5 },
  { api_player_id: 1082, name: 'Maya Yoshida',    position: 'DEF', country: 'Japan',       price: 6.0 },
  { api_player_id: 1083, name: 'Ayase Ueda',      position: 'FWD', country: 'Japan',       price: 7.5 },
  { api_player_id: 1084, name: 'Takumi Minamino', position: 'MID', country: 'Japan',       price: 8.0 },
  { api_player_id: 1085, name: 'Ritsu Doan',      position: 'MID', country: 'Japan',       price: 7.5 },

  // ── SOUTH KOREA ─────────────────────────────────────────
  { api_player_id: 1086, name: 'Kim Seung-gyu',   position: 'GK',  country: 'South Korea', price: 6.0 },
  { api_player_id: 1087, name: 'Kim Min-jae',     position: 'DEF', country: 'South Korea', price: 8.5 },
  { api_player_id: 1088, name: 'Cho Gue-sung',    position: 'FWD', country: 'South Korea', price: 7.5 },
  { api_player_id: 1089, name: 'Son Heung-min',   position: 'FWD', country: 'South Korea', price: 12.0 },
  { api_player_id: 1090, name: 'Lee Kang-in',     position: 'MID', country: 'South Korea', price: 8.5 },

  // ── AUSTRALIA ───────────────────────────────────────────
  { api_player_id: 1091, name: 'Mathew Ryan',     position: 'GK',  country: 'Australia',   price: 6.5 },
  { api_player_id: 1092, name: 'Harry Souttar',   position: 'DEF', country: 'Australia',   price: 6.5 },
  { api_player_id: 1093, name: 'Mitchell Duke',   position: 'FWD', country: 'Australia',   price: 6.5 },
  { api_player_id: 1094, name: 'Mat Leckie',      position: 'MID', country: 'Australia',   price: 7.0 },
  { api_player_id: 1095, name: 'Ajdin Hrustic',   position: 'MID', country: 'Australia',   price: 6.5 },

  // ── IRAN ────────────────────────────────────────────────
  { api_player_id: 1096, name: 'Alireza Beiranvand',position: 'GK', country: 'Iran',       price: 6.0 },
  { api_player_id: 1097, name: 'Ehsan Hajsafi',   position: 'DEF', country: 'Iran',        price: 5.5 },
  { api_player_id: 1098, name: 'Mehdi Taremi',    position: 'FWD', country: 'Iran',        price: 9.0 },
  { api_player_id: 1099, name: 'Sardar Azmoun',   position: 'FWD', country: 'Iran',        price: 8.0 },
  { api_player_id: 1100, name: 'Alireza Jahanbakhsh',position: 'MID',country: 'Iran',      price: 7.0 },

  // ── SAUDI ARABIA ────────────────────────────────────────
  { api_player_id: 1101, name: 'Mohammed Al-Owais',position: 'GK', country: 'Saudi Arabia',price: 6.5 },
  { api_player_id: 1102, name: 'Ali Al-Bulayhi',  position: 'DEF', country: 'Saudi Arabia',price: 5.5 },
  { api_player_id: 1103, name: 'Saleh Al-Shehri', position: 'FWD', country: 'Saudi Arabia',price: 7.0 },
  { api_player_id: 1104, name: 'Salem Al-Dawsari', position: 'MID', country: 'Saudi Arabia',price: 8.0 },
  { api_player_id: 1105, name: 'Mohamed Kanno',   position: 'MID', country: 'Saudi Arabia',price: 6.0 },

  // ── NIGERIA ─────────────────────────────────────────────
  { api_player_id: 1106, name: 'Francis Uzoho',   position: 'GK',  country: 'Nigeria',     price: 6.0 },
  { api_player_id: 1107, name: 'William Troost-Ekong',position: 'DEF',country: 'Nigeria',  price: 6.5 },
  { api_player_id: 1108, name: 'Victor Osimhen',  position: 'FWD', country: 'Nigeria',     price: 12.0 },
  { api_player_id: 1109, name: 'Alex Iwobi',      position: 'MID', country: 'Nigeria',     price: 7.5 },
  { api_player_id: 1110, name: 'Wilfred Ndidi',   position: 'MID', country: 'Nigeria',     price: 7.0 },

  // ── GHANA ───────────────────────────────────────────────
  { api_player_id: 1111, name: 'Lawrence Ati-Zigi',position: 'GK', country: 'Ghana',       price: 6.0 },
  { api_player_id: 1112, name: 'Daniel Amartey',  position: 'DEF', country: 'Ghana',       price: 6.0 },
  { api_player_id: 1113, name: 'Inaki Williams',  position: 'FWD', country: 'Ghana',       price: 8.5 },
  { api_player_id: 1114, name: 'Jordan Ayew',     position: 'FWD', country: 'Ghana',       price: 7.0 },
  { api_player_id: 1115, name: 'Thomas Partey',   position: 'MID', country: 'Ghana',       price: 8.5 },

  // ── ECUADOR ─────────────────────────────────────────────
  { api_player_id: 1116, name: 'Hernan Galindez',  position: 'GK', country: 'Ecuador',     price: 6.0 },
  { api_player_id: 1117, name: 'Piero Hincapie',  position: 'DEF', country: 'Ecuador',     price: 7.5 },
  { api_player_id: 1118, name: 'Enner Valencia',  position: 'FWD', country: 'Ecuador',     price: 9.0 },
  { api_player_id: 1119, name: 'Jeremy Sarmiento', position: 'MID', country: 'Ecuador',    price: 7.0 },
  { api_player_id: 1120, name: 'Moises Caicedo',  position: 'MID', country: 'Ecuador',     price: 9.5 },

  // ── SWITZERLAND ─────────────────────────────────────────
  { api_player_id: 1121, name: 'Yann Sommer',     position: 'GK',  country: 'Switzerland', price: 8.0 },
  { api_player_id: 1122, name: 'Manuel Akanji',   position: 'DEF', country: 'Switzerland', price: 8.0 },
  { api_player_id: 1123, name: 'Breel Embolo',    position: 'FWD', country: 'Switzerland', price: 8.5 },
  { api_player_id: 1124, name: 'Xherdan Shaqiri', position: 'MID', country: 'Switzerland', price: 7.5 },
  { api_player_id: 1125, name: 'Granit Xhaka',    position: 'MID', country: 'Switzerland', price: 8.5 },

  // ── DENMARK ─────────────────────────────────────────────
  { api_player_id: 1126, name: 'Kasper Schmeichel',position: 'GK', country: 'Denmark',     price: 7.5 },
  { api_player_id: 1127, name: 'Simon Kjaer',     position: 'DEF', country: 'Denmark',     price: 7.0 },
  { api_player_id: 1128, name: 'Rasmus Hojlund',  position: 'FWD', country: 'Denmark',     price: 10.0 },
  { api_player_id: 1129, name: 'Christian Eriksen',position: 'MID', country: 'Denmark',    price: 9.5 },
  { api_player_id: 1130, name: 'Pierre-Emile Hojbjerg',position: 'MID',country: 'Denmark', price: 7.5 },

  // ── POLAND ──────────────────────────────────────────────
  { api_player_id: 1131, name: 'Wojciech Szczesny',position: 'GK', country: 'Poland',      price: 8.0 },
  { api_player_id: 1132, name: 'Jan Bednarek',    position: 'DEF', country: 'Poland',      price: 6.5 },
  { api_player_id: 1133, name: 'Robert Lewandowski',position: 'FWD',country: 'Poland',     price: 12.5 },
  { api_player_id: 1134, name: 'Piotr Zielinski', position: 'MID', country: 'Poland',      price: 8.5 },
  { api_player_id: 1135, name: 'Grzegorz Krychowiak',position: 'MID',country: 'Poland',    price: 7.0 },

  // ── SERBIA ──────────────────────────────────────────────
  { api_player_id: 1136, name: 'Predrag Rajkovic', position: 'GK', country: 'Serbia',      price: 6.5 },
  { api_player_id: 1137, name: 'Nikola Milenkovic',position: 'DEF', country: 'Serbia',     price: 7.0 },
  { api_player_id: 1138, name: 'Aleksandar Mitrovic',position: 'FWD',country: 'Serbia',    price: 10.5 },
  { api_player_id: 1139, name: 'Dusan Tadic',     position: 'MID', country: 'Serbia',      price: 8.5 },
  { api_player_id: 1140, name: 'Sergej Milinkovic-Savic',position: 'MID',country: 'Serbia',price: 9.5 },
]

// ─── SEED FUNCTION ──────────────────────────────────────────
const seed = async () => {
  console.log(`Seeding ${players.length} players...`)

  // Use a transaction — if any insert fails, none are committed
  // This prevents a half-seeded database
  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    // Clear existing players first so you can re-run safely
    await client.query('DELETE FROM players')
    console.log('Cleared existing players')

    for (const player of players) {
      await client.query(
        `INSERT INTO players (api_player_id, name, position, country, price, is_injured)
         VALUES ($1, $2, $3, $4, $5, false)`,
        [player.api_player_id, player.name, player.position, player.country, player.price]
      )
    }

    await client.query('COMMIT')
    console.log(`✓ Seeded ${players.length} players successfully`)

    // Print a summary by country
    const summary = await client.query(
      `SELECT country, COUNT(*) as count 
       FROM players 
       GROUP BY country 
       ORDER BY country`
    )
    console.log('\nPlayers by country:')
    summary.rows.forEach(row => {
      console.log(`  ${row.country}: ${row.count} players`)
    })

  } catch (err) {
    await client.query('ROLLBACK')
    console.error('Seed failed, rolled back:', err)
  } finally {
    client.release()
    await pool.end()
  }
}

seed()