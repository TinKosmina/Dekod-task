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

  filterJobTitle: string = '';
  searchName: string = '';
  currentSortKey: string = '';
  currentSortDirection: 'asc' | 'desc' = 'asc';

  constructor(private employeeService: EmployeeService) { }

  ngOnInit(): void {
    this.employeeService.getEmployees().subscribe(
      (response: any[]) => {
        this.employees = response;
        this.filteredEmployees = [...this.employees];
        // console.log('Employees data fetched:', this.filteredEmployees);
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

    this.sortEmployees(this.currentSortKey, true); // reapply sorting after filtering
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

    // console.log('Employees sorted:', this.filteredEmployees);
  }
}
