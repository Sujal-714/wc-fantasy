import {describe,it,expect} from 'vitest';
import {validateSquadComposition} from '../utils/teamValidation';



describe('validateSquadComposition',()=>{
    it('passes with a valid squad', ()=>{
        const dbPlayers =[
  {
    id: 'b8b78c2c-b0bc-4a6b-b0c7-94ca16c1f555',
    price: '10.0',
    position: 'GK',
    country: 'Mexico'
  },
  {
    id: 'd42a5571-63ef-4e70-b90c-2f54a2b97a43',
    price: '6.0',
    position: 'DEF',
    country: 'Morocco'
  },
  {
    id: '45acd012-ab0c-4412-b3ce-d8c850c9dbf3',
    price: '5.0',
    position: 'FWD',
    country: 'Australia'
  },
  {
    id: '836227a8-ad42-4924-bc11-8f0277c6eb18',
    price: '5.0',
    position: 'FWD',
    country: 'Ivory Coast'
  },
  {
    id: '0230544d-50dc-40a2-ba32-d8c239ba2b6b',
    price: '6.0',
    position: 'DEF',
    country: 'Sweden'
  },
  {
    id: '10460149-4fd9-407b-b009-eedb947814c3',
    price: '6.0',
    position: 'DEF',
    country: 'Sweden'
  },
  {
    id: '17094748-2de5-4788-b363-a3d144cd2f89',
    price: '7.5',
    position: 'MID',
    country: 'Sweden'
  },
  {
    id: '5c14ea89-fabf-4c50-aac5-e9853dd893b9',
    price: '6.0',
    position: 'DEF',
    country: 'Japan'
  },
  {
    id: '62b72eb2-2b92-4de4-86fe-8ce80ec24732',
    price: '7.5',
    position: 'MID',
    country: 'Netherlands'
  },
  {
    id: '628f9405-4c76-41d6-9cdd-071b0337676c',
    price: '7.5',
    position: 'MID',
    country: 'New Zealand'
  },
  {
    id: '503b3495-1001-4e11-87f2-841160e272db',
    price: '5.0',
    position: 'FWD',
    country: 'Iran'
  },
  {
    id: 'b6148aa7-3db1-44b6-a97f-9876ac7a86cb',
    price: '9.5',
    position: 'GK',
    country: 'Uruguay'
  },
  {
    id: '8f571adf-25ea-48b9-8fef-1db21e1aed8f',
    price: '6.0',
    position: 'DEF',
    country: 'Uruguay'
  },
  {
    id: '2096dd05-1a8f-4862-80e2-e1e4d13047b3',
    price: '7.5',
    position: 'MID',
    country: 'Uruguay'
  },
  {
    id: 'caa89e4f-7dc7-4698-90e2-4117d4d2bd07',
    price: '7.5',
    position: 'MID',
    country: 'Portugal'
  }
]
const result = validateSquadComposition(dbPlayers)
expect(result.valid).toBe(true)
    })

     it('fails when budget exceeds', ()=>{
        const dbPlayers =[
  {
    id: 'b8b78c2c-b0bc-4a6b-b0c7-94ca16c1f555',
    price: '10.0',
    position: 'GK',
    country: 'Mexico'
  },
  {
    id: 'd42a5571-63ef-4e70-b90c-2f54a2b97a43',
    price: '45.0',
    position: 'DEF',
    country: 'Morocco'
  },
  {
    id: '45acd012-ab0c-4412-b3ce-d8c850c9dbf3',
    price: '5.0',
    position: 'FWD',
    country: 'Australia'
  },
  {
    id: '836227a8-ad42-4924-bc11-8f0277c6eb18',
    price: '5.0',
    position: 'FWD',
    country: 'Ivory Coast'
  },
  {
    id: '0230544d-50dc-40a2-ba32-d8c239ba2b6b',
    price: '6.0',
    position: 'DEF',
    country: 'Sweden'
  },
  {
    id: '10460149-4fd9-407b-b009-eedb947814c3',
    price: '6.0',
    position: 'DEF',
    country: 'Sweden'
  },
  {
    id: '17094748-2de5-4788-b363-a3d144cd2f89',
    price: '7.5',
    position: 'MID',
    country: 'Sweden'
  },
  {
    id: '5c14ea89-fabf-4c50-aac5-e9853dd893b9',
    price: '6.0',
    position: 'DEF',
    country: 'Japan'
  },
  {
    id: '62b72eb2-2b92-4de4-86fe-8ce80ec24732',
    price: '7.5',
    position: 'MID',
    country: 'Netherlands'
  },
  {
    id: '628f9405-4c76-41d6-9cdd-071b0337676c',
    price: '7.5',
    position: 'MID',
    country: 'New Zealand'
  },
  {
    id: '503b3495-1001-4e11-87f2-841160e272db',
    price: '5.0',
    position: 'FWD',
    country: 'Iran'
  },
  {
    id: 'b6148aa7-3db1-44b6-a97f-9876ac7a86cb',
    price: '9.5',
    position: 'GK',
    country: 'Uruguay'
  },
  {
    id: '8f571adf-25ea-48b9-8fef-1db21e1aed8f',
    price: '6.0',
    position: 'DEF',
    country: 'Uruguay'
  },
  {
    id: '2096dd05-1a8f-4862-80e2-e1e4d13047b3',
    price: '7.5',
    position: 'MID',
    country: 'Uruguay'
  },
  {
    id: 'caa89e4f-7dc7-4698-90e2-4117d4d2bd07',
    price: '7.5',
    position: 'MID',
    country: 'Portugal'
  }
]
const result = validateSquadComposition(dbPlayers)
expect(result.valid).toBe(false)
expect(result.error).toContain('exceeds')
    })
})