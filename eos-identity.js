import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';

/**
 * `eos-identity`
 * 
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class EosIdentity extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
      </style>
      <h2>Hello [[prop1]]!</h2>
    `;
  }
  static get properties() {
    return {
      prop1: {
        type: String,
        value: 'eos-identity',
      },
    };
  }

  _createIdentity(){
    const identity =   { "hash": "", "privateKey": "", "publicKey": "", "name": "", "accounts": {}, "personal": { "firstname": "", "lastname": "", "email": "", "birthdate": "" }, "locations": [ { "name": "Unnamed Location", "isDefault": false, "phone": "", "address": "", "city": "", "state": "", "country": "", "zipcode": "" } ], "kyc": false, "ridl": -1 }
  }

} window.customElements.define('eos-identity', EosIdentity);
