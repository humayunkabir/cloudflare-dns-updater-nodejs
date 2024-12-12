import axios from 'axios';

export async function updateDNS({
  ip,
  email,
  zoneId,
  dnsRecordId,
  domain,
  comment,
  token,
}: UpdateDNSPayload) {
  const options = {
    method: 'PUT',
    url: `https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records/${dnsRecordId}`,
    headers: {
      'Content-Type': 'application/json',
      'X-Auth-Email': email,
      Authorization: `Bearer ${token}`,
    },
    data: {
      comment,
      name: domain,
      proxied: true,
      settings: {},
      tags: [],
      ttl: 3600,
      content: ip,
      type: 'A',
    },
  };

  return axios
    .request<ResponseCloudflare<DNSRecord>>(options)
    .then(({ data }) => data);
}

export async function getDNSRecord({
  zoneId,
  token,
  domain,
}: GetDNSRecordsPayload): Promise<DNSRecord | undefined> {
  const options = {
    method: 'GET',
    url: `https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await axios
      .request<ResponseCloudflare<Array<DNSRecord>>>(options)
      .then(({ data }) => data);

    const dsnRecord = response.result.find(({ name }) => name === domain);

    return dsnRecord;
  } catch (error) {
    console.log(error);
  }
}
