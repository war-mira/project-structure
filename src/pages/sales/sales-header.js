const header = [
  {
    id: 'id',
    title: 'ID',
    sortable: true,
    sortType: 'number'
  },
  {
    id: 'user',
    title: 'Client',
    sortable: true,
    sortType: 'string'
  },
  {
    id: 'createdAt',
    title: 'Date',
    sortable: true,
    sortType: 'number',
    template: data => {
      return `<div class="sortable-table__cell">
            ${data ? new Date(data).toLocaleDateString("ru-RU") : 'Не указано'}
          </div>`;
    }
  },
  {
    id: 'totalCost',
    title: 'Price',
    sortable: true,
    sortType: 'number'
  },
  {
    id: 'delivery',
    title: 'Status',
    sortable: true,
    sortType: 'number',
    template: data => {
      return `<div class="sortable-table__cell">
            ${data > 0 ? 'Active' : 'Inactive'}
          </div>`;
    }
  },
];
  
export default header;
  