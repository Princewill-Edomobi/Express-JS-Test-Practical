<template>
  <div id="app" class="center mt-5">
    <b-row class="table-header">
      <b-col class="mt-3 float-left" cols="8">Clients</b-col>
      <b-col class="mt-3" cols="4">
        <b-button class=" float-right" @click="ShowDialog()">New client</b-button>
      </b-col>
    </b-row>
    <table>
      <tr>
        <th class="header-button" @click="fetchClients('name')">Name</th>
        <th class="header-button" @click="fetchClients('email')">Email</th>
        <th class="header-button" @click="fetchClients('phone')">Phone</th>
        <th class="header-button" @click="fetchClients('providers')">Providers</th>
        <th  class="header-button"></th>
      </tr>
      <tr v-for="client in clients" :key="client.id">
        <td>{{client.name}}</td>
        <td>{{client.email}}</td>
        <td>{{client.phone}}</td>
        <td>{{client.providers.map(x=>x.name).join(', ')}}</td>
        <td class="text-center">
          <b-link @click="ShowDialog(client)">Edit</b-link></td>
      </tr>
    </table>

    <b-modal size="lg" id="modal-1" centered
      :title="editClient._id ? 'Edit Client':'New Client'">
      <!-- Name -->
      <b-row class="mb-4 center">
        <b-col cols="2" class="text-center center dialog-label">Name:</b-col>
        <b-col class="mr-4 dialog-input">
          <b-form-input v-model="editClient.name" trim></b-form-input>
        </b-col>
        <b-col cols="2"></b-col>
      </b-row>
      <!-- Email -->
      <b-row class="mb-4 center">
        <b-col cols="2" class="text-center center dialog-label">Email:</b-col>
        <b-col class="mr-4 dialog-input">
          <b-form-input v-model="editClient.email" trim></b-form-input>
          <span class="warning-text sm" v-if="errors.includes('email')">email already exist</span>
        </b-col>
        <b-col cols="2"></b-col>
      </b-row>
      <!-- Phone -->
      <b-row class="mb-4 center">
        <b-col cols="2" class="text-center center dialog-label">Phone:</b-col>
        <b-col class="mr-4 dialog-input">
          <b-form-input v-model="editClient.phone" trim></b-form-input>
        </b-col>
        <b-col cols="2"></b-col>
      </b-row>
      <!-- Provider input -->
      <b-row class="mb-4 center">
        <b-col cols="1"></b-col>
        <b-col cols="2" class="text-center center">Providers:</b-col>
        <b-col cols="4">
          <b-form-input v-model="newProvider.name" trim></b-form-input>
          <span class="warning-text sm" v-if="errors.includes('name')">provider already exist</span>
        </b-col>
        <b-col cols="2" class="center">
          <b-button size="sm" class="float-left small-text"
          @click="addProvider()">
            {{newProvider.id?'Edit Provider':'Add Provider'}}
          </b-button>
        </b-col>
        <b-col cols="2"></b-col>
      </b-row>
      <div class="provider-div center">
        <b-form class="center" inline v-for="(provider,i) in providers" :key="provider._id">
          <b-form-checkbox class="mr-4 mb-2"
            v-model="editClient.hasProviders[i]">
          </b-form-checkbox>
          <label class="mr-4 mb-2">{{provider.name}}</label>
          <b-icon icon="pencil-square" class="mr-4 mb-2" @click="editProvider(provider)"></b-icon>
          <b-icon icon="trash-fill" @click="deleteProvider(provider._id)"></b-icon>
        </b-form>
      </div>
      <template #modal-footer>
        <div class="w-100">
          <b-button size="sm" class="float-left"
          @click="deleteClient()" v-if="editClient && editClient._id" variant="danger">
            Delete Client
          </b-button>
          <b-button size="sm" class="float-right ml-3" @click="saveClient()">
            {{ editClient._id ? 'Save': 'Add'}} Client
          </b-button>
          <b-button size="sm" class="float-right" @click="$bvModal.hide('modal-1');">
            Cancel
          </b-button>
        </div>
      </template>
    </b-modal>
  </div>
</template>

<script>
/* eslint no-underscore-dangle: 0 */
export default {
  name: 'App',
  components: {

  },
  props: {},
  data: () => ({
    clients: [],
    providers: [],
    editClient: {
      name: '',
      email: '',
      phone: '',
      providers: [],
    },
    showModal: false,
    newProvider: { name: '', id: null },
    sort: 1,
    errors: [],
  }),
  mounted() {
    this.fetchClients();
    this.fetchProviders();
  },
  methods: {
    fetchClients(field) {
      this.errors = [];
      let query = '';
      if (field) {
        this.sort *= -1;
        query = `?field=${field}&order=${this.sort}`;
      }
      this.axios.get(`/clients/get-all${query}`)
        .then((res) => {
          if (res && res.data) {
            this.clients = res.data;
          }
        });
    },
    fetchProviders() {
      this.errors = [];
      this.axios.get('/providers/get-all')
        .then((res) => {
          if (res && res.data) {
            this.providers = res.data;
            this.generateHasProviders();
          }
        });
    },
    newClient() {
      this.editClient = {
        name: '',
        email: '',
        phone: '',
        providers: [],
      };
      this.generateHasProviders();
    },
    saveClient() {
      const data = {
        name: this.editClient.name,
        email: this.editClient.email,
        phone: this.editClient.phone,
      };
      data.providers = [];
      for (let i = 0; i < this.providers.length; i += 1) {
        if (this.editClient.hasProviders[i]) {
          data.providers.push(this.providers[i]._id);
        }
      }
      if (this.editClient._id) {
        this.axios.patch(`/clients/update/${this.editClient._id}`, data)
          .then(() => {
            this.fetchClients();
            this.$bvModal.hide('modal-1');
          })
          .catch(() => {
            this.errors.push('email');
          });
      } else {
        this.axios.post('/clients/new/', data)
          .then(() => {
            this.fetchClients();
            this.$bvModal.hide('modal-1');
          })
          .catch(() => {
            this.errors.push('email');
          });
      }
    },
    deleteClient() {
      if (!this.editClient || !this.editClient._id) return;
      this.axios.delete(`/clients/delete/${this.editClient._id}`)
        .then(() => {
          this.fetchClients();
          this.$bvModal.hide('modal-1');
        });
    },
    addProvider() {
      if (!this.newProvider.name && this.newProvider.name === '') return;
      if (this.newProvider.id) {
        this.axios.patch(`/providers/update/${this.newProvider.id}`, { name: this.newProvider.name })
          .then(() => {
            this.fetchProviders();
            this.fetchClients();
            this.newProvider = { name: '', id: null };
          })
          .catch(() => {
            this.errors.push('name');
          });
      } else {
        this.axios.post('/providers/new/', { name: this.newProvider.name })
          .then(() => {
            this.fetchProviders();
            this.newProvider = { name: '', id: null };
          })
          .catch(() => {
            this.errors.push('name');
          });
      }
    },
    editProvider(provider) {
      this.newProvider = {
        name: provider.name,
        id: provider._id,
      };
    },
    deleteProvider(id) {
      if (!id || id === '') return;
      this.axios.delete(`/providers/delete/${id}`)
        .then(() => {
          this.fetchProviders();
          this.fetchClients();
        });
    },
    ShowDialog(client) {
      if (client) {
        this.editClient = client;
        this.generateHasProviders();
      } else {
        this.newClient();
      }
      this.$bvModal.show('modal-1');
    },
    generateHasProviders() {
      if (!this.editClient || !this.editClient.providers) return;

      this.editClient.hasProviders = [];
      this.providers.forEach((p) => {
        if (this.editClient.providers.find((x) => x._id === p._id)) {
          this.editClient.hasProviders.push(true);
        } else {
          this.editClient.hasProviders.push(false);
        }
      });
    },
  },
};
</script>

<style>
.table-header{
  height: 75px;
  width: 76%;
  margin: auto !important;
  background: lightblue;
  font-size: 1.5rem;
}
.table-header .col{
  padding-top: 20px ;
}
.center{
  margin: auto;
  justify-content: center;
}
.dialog-label{
  margin-left: 92px;
}
.dialog-input{
  max-width: 51%;
}
.provider-div{
  width: 35%;
  border: solid 1px lightgray;
  padding-top: 20px;
  padding-bottom: 20px;
}
.header-button{
  text-align: center;
  background-color: gray;
  cursor: pointer;
}

.warning-text.sm{
  color: red;
  font-size: 0.75rem;
}
.small-text{
  font-size: 0.85rem;
}
table {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 76%;
  margin: auto;
}

td, th {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
}

tr:nth-child(even) {
  background-color: #dddddd;
}
</style>
