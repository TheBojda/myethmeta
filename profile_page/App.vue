<template>
  <div class="container mt-3">
    <div class="row">
      <div class="col-md-4">
        <div class="card">
          <div class="card-body" v-if="meta">
            <div class="d-flex flex-column align-items-center text-center">
              <img
                v-if="meta && meta.thumbnailUrl"
                :src="getGatewayUrl(meta.thumbnailUrl)"
                alt="Profile thumbnail"
                class="rounded-circle"
                width="150"
              />
              <input
                v-if="editMode"
                type="file"
                @change="thumbnailChanged"
                ref="thumbnailFileInput"
              />
              <div class="mt-3">
                <h4 v-if="!editMode">{{ meta.displayName }}</h4>
                <input
                  type="text"
                  v-model="meta.displayName"
                  v-if="editMode"
                  placeholder="Display name"
                />
                <p
                  class="text-secondary mb-1"
                  v-if="meta && meta.emails && !editMode"
                >
                  <span
                    v-for="(email, idx) in meta.emails"
                    :key="'email_' + idx"
                  >
                    <a
                      :href="'mailto:' + email.value"
                      class="link-secondary"
                      v-if="email.primary"
                      >{{ email.value }}</a
                    >
                  </span>
                </p>
                <input
                  class="mt-1 mb-1"
                  type="text"
                  v-model="editModelPrimaryEmail"
                  v-if="editMode"
                  placeholder="Primary e-mail address"
                />
                <p class="text-secondary mb-1">
                  {{ address }}
                </p>
                <button class="btn btn-outline-dark" @click="copyToClipboard">
                  <i class="bi bi-clipboard"></i>
                </button>
                <button class="btn btn-outline-dark" @click="showQRPanel">
                  <i class="bi bi-qr-code"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="d-flex flex-column align-items-center text-center mt-3">
          <button
            class="btn btn-lg btn-outline-dark w-100"
            v-if="!editMode"
            @click="jumpToEditMetadata"
          >
            Create/Edit your own metadata
          </button>
          <button class="btn btn-lg btn-outline-primary w-100" v-if="editMode">
            Save to IPFS and Polygon blockchain
          </button>
          <button
            class="btn btn-lg btn-outline-dark mt-3 w-100"
            v-if="editMode"
            @click="generateJSON"
          >
            Generate JSON for manual uploading
          </button>
        </div>
      </div>
      <div class="col-md-8">
        <div class="card">
          <div class="card-body">
            <div class="row">
              <h5>Basic data</h5>
              <hr class="col-10" />
            </div>
            <div class="row" v-if="meta && meta.name">
              <div class="col-3"><h6>Full Name</h6></div>
              <div class="col-9 text-secondary" v-if="!editMode">
                {{ meta.name.formatted }}
              </div>
              <div class="col-9 text-secondary">
                <input
                  type="text"
                  v-model="meta.name.formatted"
                  v-if="editMode"
                />
              </div>
            </div>
            <div class="row" v-if="meta && meta.birthday">
              <div class="col-3"><h6>Birthday</h6></div>
              <div class="col-9 text-secondary">{{ meta.birthday }}</div>
            </div>
            <div class="row" v-if="meta && meta.gender">
              <div class="col-3"><h6>Gender</h6></div>
              <div class="col-9 text-secondary">{{ meta.gender }}</div>
            </div>
            <div class="row mt-4">
              <h5>About me</h5>
              <hr class="col-10" />
            </div>
            <div class="row" v-if="meta && meta.aboutMe">
              <div class="col-12 text-secondary" v-if="!editMode">
                {{ meta.aboutMe }}
              </div>
              <div class="col-12 text-secondary" v-if="editMode">
                <textarea
                  v-model="meta.aboutMe"
                  placeholder="Some words about you..."
                  class="w-75"
                ></textarea>
              </div>
            </div>
            <div class="row mt-4">
              <h5>IM Contacts</h5>
              <hr class="col-10" />
            </div>
            <div class="row" v-for="(im, idx) in meta.ims" :key="'im_' + idx">
              <div class="col-3">
                <h6>
                  <button
                    class="btn btn-danger btn-sm me-1"
                    v-if="editMode"
                    @click="deleteIM(idx)"
                  >
                    x</button
                  >{{
                    im.type.substring(0, 1).toUpperCase() + im.type.substring(1)
                  }}
                </h6>
              </div>
              <div class="col-9 text-secondary">
                <a :href="getIMUrl(im.type, im.value)" class="link-secondary">{{
                  im.value
                }}</a>
              </div>
            </div>
            <div class="row" v-if="editMode">
              <div class="col-3">
                <button class="btn btn-primary btn-sm me-1" @click="addIM">
                  +</button
                ><input
                  type="text"
                  placeholder="IM type"
                  class="w-75"
                  v-model="editModelIM.type"
                />
              </div>
              <div class="col-9 text-secondary">
                <input
                  type="text"
                  placeholder="Username"
                  class="w-75"
                  v-model="editModelIM.username"
                />
              </div>
            </div>
            <div class="row mt-4">
              <h5>Accounts</h5>
              <hr class="col-10" />
            </div>
            <div
              class="row"
              v-for="(account, idx) in meta.accounts"
              :key="'acc_' + idx"
            >
              <div class="col-3">
                <h6>
                  <button
                    class="btn btn-danger btn-sm me-1"
                    v-if="editMode"
                    @click="deleteAccount(idx)"
                  >
                    x
                  </button>
                  <img
                    :src="
                      'https://www.google.com/s2/favicons?sz=18&domain_url=' +
                      account.domain
                    "
                    v-if="!editMode"
                  />
                  {{ account.domain }}
                </h6>
              </div>
              <div class="col-9 text-secondary">
                <a
                  :href="getAccountUrl(account.domain, account.username)"
                  class="link-secondary"
                  target="_blank"
                  >{{ account.username }}</a
                >
              </div>
            </div>
            <div class="row" v-if="editMode">
              <div class="col-3">
                <button class="btn btn-primary btn-sm me-1" @click="addAccount">
                  +</button
                ><input
                  type="text"
                  placeholder="Domain"
                  class="w-75"
                  v-model="editModelAccount.domain"
                />
              </div>
              <div class="col-9 text-secondary">
                <input
                  type="text"
                  placeholder="Username"
                  class="w-75"
                  v-model="editModelAccount.username"
                />
              </div>
            </div>
            <div
              class="row mt-4"
              v-if="meta && meta.urls && meta.urls.length > 0"
            >
              <h5>Web</h5>
              <hr class="col-10" />
            </div>
            <div v-if="meta && meta.urls">
              <div class="row" v-for="(webpage, idx) in meta.urls" :key="idx">
                <div class="col-12">
                  <h6>
                    <button
                      class="btn btn-danger btn-sm me-1"
                      v-if="editMode"
                      @click="deleteWebpage(idx)"
                    >
                      x
                    </button>
                    <img
                      :src="
                        'https://www.google.com/s2/favicons?sz=18&domain_url=' +
                        webpage.value
                      "
                      v-if="!editMode"
                    />
                    <a
                      :href="webpage.value"
                      class="link-secondary"
                      target="_blank"
                    >
                      {{ webpage.value }}
                    </a>
                  </h6>
                </div>
              </div>
            </div>
            <div class="row" v-if="editMode">
              <div class="col-12">
                <button class="btn btn-primary btn-sm me-1" @click="addWebpage">
                  +</button
                ><input
                  type="text"
                  placeholder="Webpage URL"
                  class="w-75"
                  v-model="editModelWebpage"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="modal" tabindex="-1" ref="qr_popup">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div
            class="modal-body d-flex flex-column align-items-center text-center"
            v-if="qrcodeImage"
          >
            <img :src="qrcodeImage" alt="qrcode" />
          </div>
        </div>
      </div>
    </div>

    <div class="modal" tabindex="-1" ref="json_popup">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div
            class="modal-body d-flex flex-column align-items-center"
            style="max-height: 500px;"
          >
            <pre class="w-100" v-html="generatedJSON"></pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import MyEthMetaClient from "myethmeta";
import { EthereumAddressMetadataJSONSchema } from "myethmeta";
import QRCode from "qrcode";
import { Modal } from "bootstrap";
import copy from "copy-to-clipboard";
import detectEthereumProvider from "@metamask/detect-provider";

@Component
class App extends Vue {
  public address: string = null;
  public meta: EthereumAddressMetadataJSONSchema = {};

  public qrcodeImage: string = null;
  public editMode: boolean = false;

  public editModelPrimaryEmail: string = null;
  public editModelIM: { type: string; username: string } = {
    type: "",
    username: "",
  };
  public editModelAccount: { domain: string; username: string } = {
    domain: "",
    username: "",
  };
  public editModelWebpage: string = "";

  public generatedJSON: string = "";

  private metaClient: MyEthMetaClient = new MyEthMetaClient();
  private ethereum: any;

  public async mounted() {
    window.onhashchange = () => {
      this.hashChanged();
    };
    this.hashChanged();
    this.ethereum = await detectEthereumProvider();
  }

  private async hashChanged() {
    if (!window.location.hash) return;
    let address = window.location.hash.substring(1);
    if (address.length < 42) return;
    if (!address.startsWith("0x")) return;

    if (address.endsWith("/edit")) {
      this.editMode = true;
      address = address.substring(0, address.length - 5);
    } else {
      this.editMode = false;
    }

    this.address = address;

    this.qrcodeImage = await QRCode.toDataURL(address, { width: 400 });

    this.meta = await this.metaClient.getMetaData(address);

    if (this.meta.emails) {
      this.editModelPrimaryEmail = this.meta.emails[0].value;
      for (const mailData of this.meta.emails) {
        if (mailData.primary) this.editModelPrimaryEmail = mailData.value;
      }
    }
  }

  public getIMUrl(type: string, value: string) {
    let url = "#";
    if (type == "skype") url = "skype:" + value;
    if (type == "telegram") url = "https://telegram.me/" + value;
    return url;
  }

  public getAccountUrl(domain: string, username: string) {
    let url = "#";
    if (domain == "twitter.com") url = "https://twitter.com/@" + username;
    if (domain == "github.com") url = "https://github.com/" + username;
    return url;
  }

  public getGatewayUrl(uri: string) {
    return this.metaClient.getGatewayURL(uri);
  }

  public showQRPanel() {
    new Modal(this.$refs.qr_popup).show();
  }

  public deleteIM(idx: number) {
    this.meta.ims.splice(idx, 1);
  }

  public addIM() {
    this.meta.ims.push({
      type: this.editModelIM.type,
      value: this.editModelIM.username,
    });
    this.editModelIM = {
      type: "",
      username: "",
    };
  }

  public deleteAccount(idx: number) {
    this.meta.accounts.splice(idx, 1);
  }

  public addAccount() {
    this.meta.accounts.push({
      domain: this.editModelAccount.domain,
      username: this.editModelAccount.username,
    });
    this.editModelAccount = {
      domain: "",
      username: "",
    };
  }

  public deleteWebpage(idx: number) {
    this.meta.urls.splice(idx, 1);
  }

  public addWebpage() {
    this.meta.urls.push({ value: this.editModelWebpage });
    this.editModelWebpage = "";
  }

  public copyToClipboard() {
    copy(this.address);
  }

  public async jumpToEditMetadata() {
    if (this.ethereum) {
      const accounts = await this.ethereum.request({
        method: "eth_requestAccounts",
      });
      const account = accounts[0];
      window.location.hash = account + "/edit";
    } else {
      alert("Please install MetaMask or use a web3 browser!");
    }
  }

  public thumbnailChanged() {
    let reader = new FileReader();
    reader.onload = (e) => {
      this.meta.thumbnailUrl = e.target.result as string;
    };
    reader.readAsDataURL((this.$refs.thumbnailFileInput as any).files[0]);
  }

  public generateJSON() {
    // syntax highlihter from https://stackoverflow.com/questions/4810841/pretty-print-json-using-javascript
    const syntaxHighlight = (json) => {
      json = json
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
      return json.replace(
        /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
        function (match) {
          var cls = "number";
          if (/^"/.test(match)) {
            if (/:$/.test(match)) {
              cls = "key";
            } else {
              cls = "string";
            }
          } else if (/true|false/.test(match)) {
            cls = "boolean";
          } else if (/null/.test(match)) {
            cls = "null";
          }
          return '<span class="' + cls + '">' + match + "</span>";
        }
      );
    };

    this.generatedJSON = syntaxHighlight(JSON.stringify(this.meta, undefined, 2));
    new Modal(this.$refs.json_popup).show();
  }
}

export default App;
</script>

<style>
pre {
  outline: 1px solid #ccc;
  padding: 5px;
  margin: 5px;
}
.string {
  color: green;
}
.number {
  color: darkorange;
}
.boolean {
  color: blue;
}
.null {
  color: magenta;
}
.key {
  color: red;
}
</style>
