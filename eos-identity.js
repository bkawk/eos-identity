import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import 'polymer-aes';
import 'polymer-bip39';
import 'polymer-store';
import './eosjs-ecc.js';
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
      <polymer-bip39 id="bip39"></polymer-bip39>
      <polymer-aes id="aes"></polymer-aes>
      <polymer-store id="store"></polymer-store>

      <template is="dom-if" if="{{debug}}">
        <small>{{error}}</small></br>
      </template>
    `;
  }
  static get properties() {
    return {
      password: {
        type: String,
        observer: "_createIdentity"
      },
      debug: {
        type: Boolean,
        valiue: false,
      },
      error: {
        type: String,
        notify: true,
        reflectToAttribute: true,
      },
      keypair: {
        type: Object,
      },
      ecc: {
        type: String,
      },
    };
  }

  _createIdentity(){
    this.createIdentity(this.password)
    .catch((err) => {
      this.error = err;
    })
  }

  // generate hash inject in identity and into account if this is the first identity
  createIdentity(password){
    return new Promise((resolve, reject) => {
      this.ecc = eosjs_ecc;
      let identity = { "hash": "", "privateKey": "", "publicKey": "", "name": "", "accounts": {}, "personal": { "firstname": "", "lastname": "", "email": "", "birthdate": "" }, "locations": [ { "name": "Unnamed Location", "isDefault": false, "phone": "", "address": "", "city": "", "state": "", "country": "", "zipcode": "" } ], "kyc": false, "ridl": -1 }
      return this.$.bip39.generateMnemonic()
      .then((data) => {
        const seed = JSON.parse(data)[1];
        const privateKey = this.ecc.PrivateKey.fromSeed(seed).toWif()
        const publicKey = this.ecc.PrivateKey.fromWif(privateKey).toPublic().toString()
        this.keypair = {}
        this.keypair.privateKey = privateKey;
        this.keypair.publicKey = publicKey;
        return this.$.bip39.mnemonicfromPassword(password)
      })
      .then((key) => {
        return this.$.aes.encrypt(JSON.parse(key)[1], this.keypair.privateKey)
      })
      .then((encPrivateKey) => {
        identity.publicKey = this.keypair.publicKey
        identity.privateKey = encPrivateKey
        return this.$.store.get('EOSAccount')
      })
      .then((eosAccount) => {
        let account = JSON.parse(eosAccount)
        account.keychain.identities.push(identity)
        this.$.store.set('EOSAccount', JSON.stringify(account))
        resolve('identity added')
      })
      .catch((err) => {
        this.error = err;
        reject(this.error)
      })
    })
  }

  _editIdentity(position){
    // create an eos key pair
    // encrypt the eos private-key with the account key
    // update the identity object
    // insert it into local storage
    const identity =   { "hash": "", "privateKey": "", "publicKey": "", "name": "", "accounts": {}, "personal": { "firstname": "", "lastname": "", "email": "", "birthdate": "" }, "locations": [ { "name": "Unnamed Location", "isDefault": false, "phone": "", "address": "", "city": "", "state": "", "country": "", "zipcode": "" } ], "kyc": false, "ridl": -1 }
  }

  _deleteIdentity(position){
    // create an eos key pair
    // encrypt the eos private-key with the account key
    // update the identity object
    // insert it into local storage
    const identity =   { "hash": "", "privateKey": "", "publicKey": "", "name": "", "accounts": {}, "personal": { "firstname": "", "lastname": "", "email": "", "birthdate": "" }, "locations": [ { "name": "Unnamed Location", "isDefault": false, "phone": "", "address": "", "city": "", "state": "", "country": "", "zipcode": "" } ], "kyc": false, "ridl": -1 }
  }

  _changePasswords(oldPassword, newPassword) {
    // check the old password is legit
    // loop through edenties and undencrypt each private key
    // re encrypt with the new private key
  }

} window.customElements.define('eos-identity', EosIdentity);
