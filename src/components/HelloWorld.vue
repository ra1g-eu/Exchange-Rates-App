<template>
  <v-row justify="center" class="pa-0 ma-0">
    <v-col
        class="text-center"
        cols="12"
    >
      <strong class="text-h6">{{ $t("currencyInsertValue") }}</strong>
    </v-col>
    <v-container>
      <v-row justify="center">
        <v-col
            xl="4"
        lg="4"
        md="6"
        sm="12">
          <v-text-field
              :label="$t('currencyTextFieldLabel')"
              v-model="currencyAmount"
              variant="outlined"
              hide-details
              single-line
              placeholder="Napíš sumu"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-container>
  </v-row>
  <v-row justify="center" class="pa-0 ma-0">
    <v-container>
      <v-row justify="center">
        <v-col sm="12"
         md="8" lg="4" xl="4">
          <v-expansion-panels>
          <v-expansion-panel>
            <v-expansion-panel-title>
              {{$t('expansionTileNumberSelect')}}
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-row justify="center">
                <v-col sm="4" md="4" lg="3" xl="3" v-for="(button, index) in buttons" :key="index">
                  <v-card

                      hover
                      @click="addNumber(button)"
                      class="border border-4 border-primary"
                  >
                    <v-card-text
                        class="text-h5 flex-grow-1 text-center">
                      <div v-if="button === 'C'">
                        <v-icon icon="mdi-delete" color="red" size="small"></v-icon>
                      </div>
                      <div v-else-if="button === 'B'">
                        <v-icon icon="mdi-backspace" color="warning" size="small"></v-icon>
                      </div>
                      <div v-else>
                        {{ button }}
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-expansion-panel-text>
          </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
      </v-row>
    </v-container>
  </v-row>
  <v-row justify="center">
    <v-col
        class="text-center"
        cols="12"
    >
      <strong class="text-h6">{{ $t("currencyConvertFrom") }}</strong>
    </v-col>
    <v-item-group v-model="selectionFrom" mandatory>
      <v-container>
        <v-row>
          <v-col
              v-for="(currency, index) in currenciesFrom"
              :key="index"
              xl="4"
              lg="4"
              sm="6"
              md="6"

          >
            <v-item v-slot="{ isSelected, toggle }">
              <v-card
                  :color="isSelected ? 'success' : ''"
                  @click="toggle"
                  class="pa-2"
              >
                <v-card-text
                    class="text-h4 flex-grow-1 text-center"
                >
                  {{ currency }}
                </v-card-text>
              </v-card>
            </v-item>
          </v-col>
        </v-row>
      </v-container>
    </v-item-group>
  </v-row>
  <v-row justify="center">
    <v-col
        class="text-center"
        cols="12"
    >
      <strong class="text-h6">{{ $t("currencyConvertTo") }}</strong>
    </v-col>

    <v-item-group v-model="selectionTo" mandatory>
      <v-container>
        <v-row>
          <v-col
              v-for="(currency, index) in currenciesTo"
              :key="index"
              xl="4"
              lg="4"
              sm="6"
              md="6"

          >
            <v-item v-slot="{ isSelected, toggle }">
              <v-card
                  :color="isSelected ? 'warning' : ''"
                  @click="toggle"
                  class="pa-2"
              >
                <v-card-text
                    class="text-h4 flex-grow-1 text-center"
                >
                  {{ currency }}
                </v-card-text>
              </v-card>
            </v-item>
          </v-col>
        </v-row>
      </v-container>
    </v-item-group>
  </v-row>
  <v-row justify="center">
    <v-col
        class="text-center"
        cols="12"
    >
      <strong class="text-h6">{{ $t("currencyConvertResult") }}</strong>
    </v-col>
    <v-col
        xl="3"
        lg="3"
        sm="6"
        md="6"
    >
      <v-card
          color=""
          class="pa-1"
          style="border: 1px solid lightgreen;"
      >

        <v-card-text
            class="text-h5 flex-grow-1 text-center" v-if="currencyAmount >= 0.00001"
        >
          <strong>{{ currencyAmount }}</strong> <span class="text-h6">{{ currenciesFrom.at(selectionFrom) }}</span>
          <v-icon icon="mdi-arrow-right" size="small"></v-icon>
          <strong>{{ convertedAmount }}</strong> <span class="text-h6">{{ currenciesTo.at(selectionTo) }}</span>
        </v-card-text>
        <v-card-text
            class="text-h5 flex-grow-1 text-center" v-else
        >
          <v-icon icon="mdi-all-inclusive" size="small"></v-icon>
        </v-card-text>
      </v-card>
      <v-card-text>
        <p class="text-center text-caption text-medium-emphasis">1 {{ currenciesFrom.at(selectionFrom) }} <v-icon icon="mdi-arrow-right" size="small"></v-icon>
          {{ currenciesFrom.at(selectionFrom) == currenciesTo.at(selectionTo) ? '1' : (convertedAmount/this.currencyAmount).toFixed(3)}} {{currenciesTo.at(selectionTo) }}</p>
      </v-card-text>
    </v-col>
  </v-row>
</template>

<script>


export default {
  name: 'HelloWorld',
  data() {
    return {
      currencyAmount: '0',
      currencyResult: 0,
      selectionFrom: "",
      selectionTo: "",
      currenciesFrom: ["EUR", "USD", "GBP", "CZK", "TRY"],
      currenciesTo: ["EUR", "USD", "GBP", "CZK", "TRY"],
      conversionRate: 0,
      buttons: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", 'B', "C"],
    }
  },
  computed: {
    convertedAmount() {
      let result = this.currencyResult;
      let regExp = /^0[0-9].*$/
      let cRate = this.conversionRate;
      if (this.selectionFrom !== "" && this.selectionTo !== "" && this.currencyAmount != null) {
        if (this.currenciesFrom.at(this.selectionFrom).trim() === this.currenciesTo.at(this.selectionTo).trim()) {
           return cRate = 1;
        } else {
          if (!regExp.test(this.currencyAmount) && this.currencyAmount >= 0) {
            if (this.selectionFrom !== "" && this.selectionTo !== "") {
              if(localStorage.getItem("ExchangeRates_ERA")){
                let rates = JSON.parse(localStorage.getItem("ExchangeRates_ERA"));
                for(let rate of rates){
                  if(rate.curr_from == this.currenciesFrom.at(this.selectionFrom).trim() && rate.curr_to == this.currenciesTo.at(this.selectionTo).trim()){
                    cRate = rate.currencyRate;
                    result = this.currencyAmount * cRate;
                    return result.toFixed(3);
                  }
                }
              } else {
                result = this.currencyAmount * this.conversionRate;
                return result.toFixed(3);
              }
            }
          }
        }
      }
      return result.toFixed(0);
    }
  },
  methods: {
    addNumber(number){
      let regExp = /^0[0-9].*$/
      if(number === 'B'){
        this.currencyAmount = this.currencyAmount.toString().slice(0, -1);
        this.currencyAmount = parseFloat(this.currencyAmount);
      }
      if(number === 'C'){
        this.currencyAmount = 0;
      }
      if(!this.currencyAmount.toString().startsWith('.') && this.currencyAmount >= 0){
        if(regExp.test(this.currencyAmount)) {
          this.currencyAmount = 0;
        } else {
          this.currencyAmount = this.currencyAmount.toString().concat(number);
          this.currencyAmount = parseFloat(this.currencyAmount);
        }
        }
    }
  }
}
</script>
