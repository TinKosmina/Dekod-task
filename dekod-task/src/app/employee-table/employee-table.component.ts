import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../employee.service';

@Component({
  selector: 'app-employee-table',
  templateUrl: './employee-table.component.html',
  styleUrls: ['./employee-table.component.css']
})
export class EmployeeTableComponent implements OnInit {
  employees: any[] = [];
  filteredEmployees: any[] = [];
  paginatedEmployees: any[] = [];

  filterJobTitle: string = '';
  searchName: string = '';
  currentSortKey: string = '';
  currentSortDirection: 'asc' | 'desc' = 'asc';

  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;

  constructor(private employeeService: EmployeeService) { }

  ngOnInit(): void {
    this.employeeService.getEmployees().subscribe(
      (response: any[]) => {
        this.employees = response;
        this.filteredEmployees = [...this.employees];
        this.updatePagination();
        console.log('Employees data fetched:', this.filteredEmployees);
      },
      error => {
        console.error('Error fetching employee data:', error);
      }
    );
  }

  applyFilters(): void {
    if (!this.employees || !Array.isArray(this.employees)) {
      return;
    }

    this.filteredEmployees = this.employees.filter(employee => {
      const matchesJobTitle = employee.jobTitle.toLowerCase().includes(this.filterJobTitle.toLowerCase());
      const matchesName = employee.firstName.toLowerCase().includes(this.searchName.toLowerCase()) || employee.lastName.toLowerCase().includes(this.searchName.toLowerCase());
      return matchesJobTitle && matchesName;
    });

    this.currentPage = 1; // Reset to the first page on filter
    this.sortEmployees(this.currentSortKey, true); // Reapply sorting after filtering
    this.updatePagination(); // Update pagination after filtering
  }

  sortEmployees(key: string, maintainDirection: boolean = false): void {
    if (!this.filteredEmployees || !Array.isArray(this.filteredEmployees)) {
      return;
    }

    if (!maintainDirection) {
      if (this.currentSortKey === key) {
        this.currentSortDirection = this.currentSortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        this.currentSortDirection = 'asc';
      }
      this.currentSortKey = key;
    }

    this.filteredEmployees.sort((a, b) => {
      const valueA = a[key];
      const valueB = b[key];

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return this.currentSortDirection === 'asc'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      } else if (typeof valueA === 'number' && typeof valueB === 'number') {
        return this.currentSortDirection === 'asc' ? valueA - valueB : valueB - valueA;
      } else if (key === 'dateOfBirth') {
        const dateA = new Date(valueA);
        const dateB = new Date(valueB);
        return this.currentSortDirection === 'asc' ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
      }
      return 0;
    });

    // this.updatePagination(); // Update pagination after sorting
    console.log('Employees sorted:', this.filteredEmployees);
  }

  // Pagination methods
  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredEmployees.length / this.itemsPerPage);
    this.paginatedEmployees = this.filteredEmployees.slice((this.currentPage - 1) * this.itemsPerPage, this.currentPage * this.itemsPerPage);
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.updatePagination();
  }

  getPaginationArray(): number[] {
    return Array(this.totalPages).fill(0).map((x, i) => i + 1);
  }
}
