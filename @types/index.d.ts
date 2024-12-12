type ResponseCloudflare<T> = {
  result: T;
  success: boolean;
  errors: Array<any>;
  messages: Array<any>;
};

type GetDNSRecordsPayload = {
  token: string;
  zoneId: string;
  domain: string;
};

type UpdateDNSPayload = {
  ip: string;
  email: string;
  domain: string;
  zoneId: string;
  dnsRecordId: string;
  comment: string;
  token: string;
};

type DNSRecord = {
  id: string;
  zone_id: string;
  zone_name: string;
  name: string;
  type: string;
  content: string;
  proxiable: boolean;
  proxied: boolean;
  ttl: number;
  settings: {};
  meta: {
    auto_added: boolean;
    managed_by_apps: boolean;
    managed_by_argo_tunnel: boolean;
  };
  comment: any;
  tags: Array<any>;
  created_on: string;
  modified_on: string;
};

type Ip = { ip: string };
