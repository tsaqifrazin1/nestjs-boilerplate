import { Injectable } from '@nestjs/common';
import * as ldapjs from 'ldapjs';
import { Client } from 'ldapjs';

@Injectable()
export class LdapService {
  private ldapClient: Client;

  constructor() {
    this.ldapClient = ldapjs.createClient({
      url: 'ldap://localhost:389',
      bindDN: 'cn=admin,dc=txvlab,dc=local',
      bindCredentials: 'pass123',
      reconnect: true,
    });
  }

  async search(username: string) {
    return new Promise((resolve, reject) => {
      try {
        const opts: ldapjs.SearchOptions = {
          filter: `(cn=${username})`,
          scope: 'sub',
        };
        let user = null;
        this.ldapClient.search('dc=txvlab,dc=local', opts, (err, res) => {
          if (err) {
            console.log(err);
            user = err;
          }
          res.on('searchEntry', (entry: ldapjs.SearchEntry) => {
            console.log('entry: ' + JSON.stringify(entry.toString()));

            user = entry.toString();
          });
          res.on('error', (err) => {
            console.error('error: ' + err.message);
            user = err;
          });
          res.on('end', (result) => {
            user
              ? resolve({ user: JSON.parse(user), status: result.status })
              : reject({ message: 'user not found', status: result.status });
          });
        });
      } catch (error) {
        reject(error);
      }
    });
  }
}
