<template>
  <div>
    <navbar></navbar>
    <search></search>
    <router-view></router-view>
    <footer-etalab></footer-etalab>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar'
import Search from '@/components/Search'
import Results from '@/components/Results'
import Etablissement from '@/components/Etablissement'
import FooterEtalab from '@/components/FooterEtalab'

export default {
  name: 'app',
  components: {
    'Navbar': Navbar,
    'Search': Search,
    'Results': Results,
    'Etablissement': Etablissement,
    'FooterEtalab': FooterEtalab
  }
}
</script>
