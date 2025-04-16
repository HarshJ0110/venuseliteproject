document.addEventListener("DOMContentLoaded", () => {
    // DOM elements
    const blogContainer = document.getElementById("blogContainer")
    const loadingElement = document.getElementById("loading")
    const exploreButton = document.querySelector(".cta-button")
    const blogSection = document.querySelector(".blog-section")
  
    let blogPosts = []
    let currentIndex = 0
  
    // Add event listener to the explore button to scroll to blog section
    exploreButton.addEventListener("click", () => {
    //   blogSection.scrollIntoView({ behavior: "smooth" })
      const offset = 64; 
      const topPos = blogSection.getBoundingClientRect().top + window.scrollY - offset;
      
      window.scrollTo({
        top: topPos,
        behavior: "smooth"
      });
      
    })
  
    // Function to create blog cards
    function createBlogCard(post) {
    console.log("Creating blog card for post:", post.image)
      const blogCard = document.createElement("div")
      blogCard.className = "blog-card"
      blogCard.dataset.id = post.id
  
      blogCard.innerHTML = `
            <div class="blog-image">
                <img src="${post.image}" alt="${post.title}" onerror="this.onerror=null; this.src='/placeholder.svg?height=400&width=600&text=${encodeURIComponent(post.title)}'; this.classList.add('error');">
            </div>
            <div class="blog-content">
                <p class="blog-date">${post.date}</p>
                <h3 class="blog-title">${post.title}</h3>
                <p class="blog-excerpt">${post.excerpt}</p>
                <span class="read-more">Read More</span>
            </div>
        `
  
      // Add event listener to open modal
      blogCard.querySelector(".read-more").addEventListener("click", () => {
        openModal(post)
      })
  
      return blogCard
    }
  
    // Function to open modal
    function openModal(post) {
      document.getElementById("modalTitle").textContent = post.title
      document.getElementById("modalDate").textContent = post.date
      document.getElementById("modalImage").src = post.image
      document.getElementById("modalImage").alt = post.title
      document.getElementById("modalImage").onerror = function () {
        this.onerror = null
        this.src = `/placeholder.svg?height=400&width=600&text=${encodeURIComponent(post.title)}`
        this.classList.add("error")
      }
      document.getElementById("modalDescription").innerHTML = post.description
  
      document.getElementById("blogModal").style.display = "block"
      document.body.style.overflow = "hidden" // Prevent scrolling when modal is open
    }
  
    // Function to close modal
    document.querySelector(".close-button").addEventListener("click", () => {
      document.getElementById("blogModal").style.display = "none"
      document.body.style.overflow = "auto" // Re-enable scrolling
    })
  
    // Close modal when clicking outside of it
    window.addEventListener("click", (event) => {
      if (event.target === document.getElementById("blogModal")) {
        document.getElementById("blogModal").style.display = "none"
        document.body.style.overflow = "auto"
      }
    })
  
    // Fetch blog posts from JSON file
    async function fetchBlogPosts() {
      try {
        const response = await fetch("blog.json")
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        blogPosts = data.posts // Access the posts array from the object
        console.log("Blog posts data:", blogPosts)
        loadMorePosts()
      } catch (error) {
        console.error("Error fetching blog posts:", error)
        // Display error message to user
        blogContainer.innerHTML = '<p class="error-message">Failed to load blog posts. Please try again later.</p>'
        loadingElement.style.display = "none"
      }
    }
  
    function loadMorePosts() {
      const fragment = document.createDocumentFragment()
      const postsToLoad = 3 // Number of posts to load at once
  
      for (let i = 0; i < postsToLoad; i++) {
        if (currentIndex < blogPosts.length) {
          const blogCard = createBlogCard(blogPosts[currentIndex])
          fragment.appendChild(blogCard)
          currentIndex++
        }
      }
  
      blogContainer.appendChild(fragment)
    }
  
    // Infinite scroll implementation
    function isElementInViewport(el) {
      const rect = el.getBoundingClientRect()
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      )
    }
  
    function handleScroll() {
      if (isElementInViewport(loadingElement) && currentIndex < blogPosts.length) {
        loadingElement.style.display = "block"
  
        // Simulate loading delay
        setTimeout(() => {
          loadMorePosts()
          loadingElement.style.display = "none"
        }, 1000)
      }
  
      // Hide loading when all posts are loaded
      if (currentIndex >= blogPosts.length) {
        loadingElement.style.display = "none"
      }
    }
  
    window.addEventListener("scroll", handleScroll)
  
    // Initialize by fetching blog posts
    fetchBlogPosts()
  
    // Initial check in case the page is not tall enough for scrolling
    setTimeout(handleScroll, 500)
  })
  