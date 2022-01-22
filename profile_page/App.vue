<template>
  <div class="container mt-3">
    <div class="row">
      <div class="col-md-4">
        <div class="card">
          <div class="card-body" v-if="meta">
            <div class="d-flex flex-column align-items-center text-center">
              <img
                :src="thumbnailUrl"
                alt="Profile thumbnail"
                class="rounded-circle"
                width="150"
              />
              <div class="mt-3">
                <h4>{{ meta.displayName }}</h4>
                <p class="text-secondary mb-1" v-if="primaryEmail">
                  <a :href="primaryEmail.url" class="link-secondary">{{
                    primaryEmail.email
                  }}</a>
                </p>
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
              <div class="col-9 text-secondary">{{ meta.name.formatted }}</div>
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
              <div class="col-12 text-secondary">
                {{ meta.aboutMe }}
              </div>
            </div>
            <div class="row mt-4">
              <h5>IM Contacts</h5>
              <hr class="col-10" />
            </div>
            <div class="row" v-for="(im, idx) in ims" :key="'im_' + idx">
              <div class="col-3">
                <h6>{{ im.name }}</h6>
              </div>
              <div class="col-9 text-secondary">
                <a :href="im.url" class="link-secondary">{{ im.value }}</a>
              </div>
            </div>
            <div class="row mt-4">
              <h5>Accounts</h5>
              <hr class="col-10" />
            </div>
            <div
              class="row"
              v-for="(account, idx) in accounts"
              :key="'acc_' + idx"
            >
              <div class="col-3">
                <h6>
                  <img
                    :src="
                      'https://www.google.com/s2/favicons?sz=18&domain_url=' +
                      account.domain
                    "
                  />
                  {{ account.domain }}
                </h6>
              </div>
              <div class="col-9 text-secondary">
                <a :href="account.url" class="link-secondary" target="_blank">{{
                  account.username
                }}</a>
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
                    <img
                      :src="
                        'https://www.google.com/s2/favicons?sz=18&domain_url=' +
                        webpage.value
                      "
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
            v-if="qrcode_image"
          >
            <img :src="qrcode_image" alt="qrcode" />
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

@Component
class App extends Vue {
  public address: string = null;
  public meta: EthereumAddressMetadataJSONSchema = null;

  public thumbnailUrl: string = null;
  public primaryEmail: { email: string; url: string } = null;
  public ims: { name: string; url: string; value: string }[] = [];
  public accounts: { domain: string; username: string; url: string }[] = [];
  public qrcode_image: string = null;

  private metaClient: MyEthMetaClient = new MyEthMetaClient();

  public async mounted() {
    window.onhashchange = () => {
      this.hashChanged();
    };
    this.hashChanged();
  }

  private async hashChanged() {
    if (!window.location.hash) return;
    let address = window.location.hash.substring(1);
    if (address.length < 42) return;
    if (!address.startsWith("0x")) return;

    this.address = address;

    this.qrcode_image = await QRCode.toDataURL(address, { width: 400 });

    this.meta = await this.metaClient.getMetaData(address);

    this.thumbnailUrl = this.metaClient.getGatewayURL(this.meta.thumbnailUrl);

    if (this.meta.emails) {
      let primaryEmail = this.meta.emails[0].value;
      for (const mailData of this.meta.emails) {
        if (mailData.primary) primaryEmail = mailData.value;
      }
      this.primaryEmail = {
        email: primaryEmail,
        url: "mailto:" + primaryEmail,
      };
    }

    if (this.meta.ims) {
      for (const im of this.meta.ims) {
        let url = "#";
        if (im.type == "skype") url = "skype:" + im.value;
        if (im.type == "telegram") url = "https://telegram.me/" + im.value;

        this.ims.push({
          name: im.type.substring(0, 1).toUpperCase() + im.type.substring(1),
          url: url,
          value: im.value,
        });
      }
    }

    if (this.meta.accounts) {
      for (const account of this.meta.accounts) {
        let url = "#";
        if (account.domain == "twitter.com")
          url = "https://twitter.com/@" + account.username;
        if (account.domain == "github.com")
          url = "https://github.com/" + account.username;

        this.accounts.push({
          domain: account.domain,
          username: account.username,
          url: url,
        });
      }
    }
  }

  public showQRPanel() {
    new Modal(this.$refs.qr_popup).show();
  }

  public copyToClipboard() {
    copy(this.address);
  }
}

export default App;
</script>

<style>
</style>
