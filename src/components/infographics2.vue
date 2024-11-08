  <template>
    <div class="dashboard bg-blue-500 text-white p-6">
      <!-- Header Section -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-2xl font-bold">Hello, Sourabh</h1>
          <p class="text-sm">Welcome back! Let's Start your trade with best strategies by us</p>
        </div>
        <a href="#" class="text-yellow-400 hover:text-yellow-300">View Profile >></a>
      </div>
  
      <!-- Cards Section -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Total Users Card -->
        <div class="bg-white text-black p-4 rounded-lg shadow">
          <h2 class="text-xl font-bold">Total Users</h2>
          <p class="text-3xl font-bold">1527</p>
          <p class="text-sm text-gray-500">Updated 5 min ago</p>
          <div class="mt-2">
            <!-- Placeholder for Chart (e.g., SVG or Canvas) -->
            <div class="h-16 bg-blue-200 rounded"></div>
          </div>
        </div>
  
        <!-- Strategy Card -->
        <div class="bg-white text-black p-4 rounded-lg shadow">
          <h2 class="text-xl font-bold">Strategy</h2>
          <p class="text-3xl font-bold">2</p>
          <p class="text-sm text-gray-500">Updated 5 min ago</p>
          <div class="mt-2">
            <!-- Placeholder for Chart -->
            <div class="h-16 bg-blue-200 rounded"></div>
          </div>
        </div>
  
        <!-- Today's Order Card -->
        <div class="bg-white text-black p-4 rounded-lg shadow">
          <h2 class="text-xl font-bold">Today's Order</h2>
          <p class="text-3xl font-bold">20</p>
          <p class="text-sm text-gray-500">Updated 5 min ago</p>
          <div class="mt-2">
            <!-- Placeholder for Chart -->
            <div class="h-16 bg-blue-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  // No special JavaScript is required for this layout,
  // but you can add props or data here if necessary.
  </script>
  
  <style scoped>
  /* Optional: Custom styles if needed */
  </style>
  