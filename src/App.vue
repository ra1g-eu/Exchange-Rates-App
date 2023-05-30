<template>
  <v-app>

    <v-navigation-drawer
        v-model="drawer"
        fixed
        temporary
    >
      <template v-slot:prepend>
        <v-list-item
                     two-line
                     prepend-icon="mdi-account-voice"
                     color="primary darken-5"
        >
          <v-select v-model="$i18n.locale" :items="locales" @update:modelValue="updateLanguage" hide-details
                    item-title="text"
                    item-value="abbr"
                    class="justify-center"
                    rounded
          >
          </v-select>
        </v-list-item>
      </template>
      <v-divider></v-divider>

        <v-list-item
            two-line
            prepend-icon="mdi-refresh"
            color="primary darken-5"
        >
          <v-btn variant="outlined" @click="refreshRates">{{$t('refreshRatesButton')}}</v-btn>
        </v-list-item>

    </v-navigation-drawer>
    <v-app-bar prominent app density="comfortable">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>{{ $t("title") }}</v-toolbar-title>
    </v-app-bar>
    <v-main>
      <v-container>
        <router-view></router-view>
      </v-container>
    </v-main>
    <v-footer>
      <v-card
          elevation="0"
          rounded="0"
          width="100%"
          class="text-center"
      >
        <v-card-text>
          <p class="text-center text-medium-emphasis">{{ $t('lastExchangeRateUpdate') }}: {{ new Date(parseInt(this.lastUpdate)).toLocaleString()}}</p>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-text class="text-white">
          {{ new Date().getFullYear() }} — <strong>ER App</strong>
        </v-card-text>
      </v-card>
    </v-footer>
  </v-app>
</template>

<script>
import Swal from "sweetalert2";

export default {
  name: 'App',
  data() {
    return {
      drawer: null,
      locales: [{abbr:"en", text: "English"}, {abbr:"sk",text: "Slovak"}],
      lastUpdate: null,
    }
  },
  methods: {
    updateLanguage() {
      localStorage.setItem("locale", this.$i18n.locale);
    },
    async refreshRates(){
      if((Date.now() - parseInt(localStorage.getItem('LastRefresh_ERA'))) >= 259200000){
        try {
          await this.$axios.get(this.$apiUrl + "api/exchange/getAllConversionRates/").then(response => {
            if (response.data.status == 'success') {
              localStorage.setItem("ExchangeRates_ERA", JSON.stringify(response.data.message));
            }
          });
        } catch (err) {
          Swal.fire({
            title: this.$loc.global.t('apiStatusError'),
            text: this.$loc.global.t('apiResponseError'),
            icon: "warning",
            confirmButtonText: 'OK',
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.close();
            }
          });
        }
      } else {
        Swal.fire({
          title: this.$loc.global.t('refreshStatusError'),
          html: this.$loc.global.t('refreshResponseError') + '<br>' + new Date(parseInt(this.lastUpdate)+259200000).toLocaleString(),
          icon: "warning",
          confirmButtonText: 'OK',
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.close();
          }
        });
      }
    },
    async refreshAuto(){
      try {
        await this.$axios.get(this.$apiUrl + "api/exchange/getAllConversionRates/").then(response => {
          if (response.data.status == 'success') {
            console.log(response.data.message);
            localStorage.setItem("ExchangeRates_ERA", JSON.stringify(response.data.message));
          }
        });
      } catch (err) {
        console.log(err)
      }
    }
  },
  mounted() {
    if(!localStorage.getItem('LastRefresh_ERA')){
      this.refreshAuto();
      localStorage.setItem("LastRefresh_ERA", Date.now().toString());
    } else if((Date.now() - parseInt(localStorage.getItem('LastRefresh_ERA'))) >= 259200000){
      this.refreshAuto();
      localStorage.setItem("LastRefresh_ERA", Date.now().toString());
    }
    document.title = "ER App";
    if (localStorage.getItem("locale")) {
      this.$i18n.locale = localStorage.getItem("locale");
    } else {
      localStorage.setItem("locale", this.$i18n.locale);
    }
    this.lastUpdate = localStorage.LastRefresh_ERA;
  },
}
</script>
