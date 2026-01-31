<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const results = ref([]);
const loading = ref(false);

const fetchSearchResults = async () => {
  const query = route.query.q;
  if (!query) return;

  loading.value = true;
  try {
    const response = await axios.get(`http://localhost:5000/api/products?search=${query}`);
    results.value = response.data.products;
  } catch (error) {
    console.error("검색 실패", error);
  } finally {
    loading.value = false;
  }
};

// URL의 쿼리 파라미터가 변할 때마다 다시 검색
watch(() => route.query.q, fetchSearchResults);

onMounted(fetchSearchResults);
</script>

<template>
  <div class="search-page">
    <h2>'{{ route.query.q }}' 검색 결과 ({{ results.length }})</h2>
    
    <div v-if="loading" class="loading">검색 중...</div>
    <div v-else-if="results.length === 0" class="empty">검색 결과가 없습니다.</div>
    
    <div v-else class="product-grid">
      <div v-for="product in results" :key="product._id" class="product-card">
        <img :src="`http://localhost:5000/${product.thumbnail}`" />
        <p>{{ product.name.ko }}</p>
        <p>{{ product.finalPrice.toLocaleString() }}원</p>
      </div>
    </div>
  </div>
</template>