<template>
  <paginate
    ref="paginate"
    :container-class="'pagination'"
    :page-class = "'pagesButtons'"
    :prev-class="'pagesButtons'"
    :next-class="'pagesButtons'"
    :page-count="totalPageNumber"
    :initial-page="initialPage"
    :prev-text="'Precédent'"
    :next-text="'Suivant'"
    :click-handler="selectPage">
  </paginate>
</template>

<script>
import Paginate from 'vuejs-paginate'
import Vue from 'vue'

Vue.component('paginate', Paginate)

export default {
  name: 'Results',
  data: function () {
    return {
      initialPage: parseInt(this.$store.state.route.query.page, 10) - 1
    }
  },
  computed: {
    totalPageNumber: function () {
      return parseInt(this.$store.getters.totalPageNumber, 10)
    }
  },
  methods: {
    selectPage (pageNum) {
      if (this.$store.state.route.query.fullText) {
        this.$store.commit('setPage', pageNum)
        this.$store.dispatch('requestSearch')
      } else {
        this.$store.dispatch('goToClearedHomePage')
      }
    }
  }
}
</script>

<style lang="scss">

.pagination {
	list-style: none;
  display: flex;
  justify-content: flex-end;
}

.pagesButtons {
  background: transparentize($color-light-blue, .8);
  border-radius: 3px;
  padding: 2px 5px;
  margin-left: 8px;

  &.disabled, &:first-child, &:last-child {
    background: none;
  }

  &.active {
    background-color: $color-light-blue;

    a {
      color: $color-white;
    }
  }
}

.pagesButtons a {
  color: $link-color;
  font-weight: 700;
}

</style>
