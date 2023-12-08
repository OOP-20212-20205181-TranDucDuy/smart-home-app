export default function filterRowsBySearch(rows, searchInput) {
    return rows.filter((row) =>
      Object.values(row).some(
        (value) =>
          value && value.toString().toLowerCase().includes(searchInput.toLowerCase())
      )
    );
  }