document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('searchInput');
  const yearFilter = document.getElementById('yearFilter');
  const examFilter = document.getElementById('examFilter');
  const batchCards = document.querySelectorAll('.batch-card');
  const searchBtn = document.querySelector('.search-btn');

  // Initialize with animation
  if (batchCards.length) {
    batchCards.forEach((card, index) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(30px)';
      setTimeout(() => {
        card.style.transition = 'all 0.6s ease-out';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, index * 100);
    });
  }

  // Search functionality with animation
  function filterCourses() {
    if (!batchCards.length) return;
    
    const searchTerm = searchInput?.value?.toLowerCase() || '';
    const selectedYear = yearFilter?.value || '';
    const selectedExam = examFilter?.value || '';

    batchCards.forEach((card, index) => {
      const title = card.querySelector('h3')?.textContent?.toLowerCase() || '';
      const matchesSearch = title.includes(searchTerm);
      const matchesYear = !selectedYear || title.includes(selectedYear);
      const matchesExam = !selectedExam || title.toLowerCase().includes(selectedExam.toLowerCase());

      if (matchesSearch && matchesYear && matchesExam) {
        card.style.display = 'block';
        card.classList.add('filtered');
        card.style.animationDelay = `${index * 100}ms`;
      } else {
        card.style.display = 'none';
        card.classList.remove('filtered');
      }
    });
  }

  // Event listeners
  if (searchInput) {
    searchInput.addEventListener('input', filterCourses);
  }
  if (yearFilter) {
    yearFilter.addEventListener('change', filterCourses);
  }
  if (examFilter) {
    examFilter.addEventListener('change', filterCourses);
  }
  if (searchBtn) {
    searchBtn.addEventListener('click', filterCourses);
  }
});