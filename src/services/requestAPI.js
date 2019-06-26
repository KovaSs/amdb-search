class GetRequest {
  constructor() {
    this._apiBase = 'https://10.96.205.191:443'
  }

  getPostCompanyInfo = async (inn) => {
    const api = { 
      type: 'get_company_info',
      data: {
        code: inn
      }
    }
    const data = new FormData()
    console.log('data', data)
    
    const res = await fetch(`/cgi-bin/serg/0/6/9/reports/276/otkrytie_scheta.pl`,{
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      body : JSON.stringify(api),
      headers: {
        // 'Accept': 'application/json, text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        // 'Content-type': 'application/json'
      },
    })
    if(!res.ok) {
      throw new Error(`Could not fetch, received ${res.status}`)
    }
    return await res.json()
  }
}

export const apiRequest = new GetRequest()