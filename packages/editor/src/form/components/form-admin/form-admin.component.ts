import { Component, OnInit } from '@angular/core';
// import { FormService } from '../../services/form.service';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'form-admin',
  templateUrl: './form-admin.component.html',
  styleUrls: ['./form-admin.component.scss']
})
export class FormAdminComponent implements OnInit {

//   constructor(private formService: FormService) { }

  formsData: any;
  forms = new MatTableDataSource<any>();
  pageLoaded: any;
  
  displayedColumns = ['name', 'code', 'createdOn', 'editForm'];

  ngOnInit() {
    // this.formService.getForms().subscribe(res => {
    //   this.forms = new MatTableDataSource<any>(res);
    // });
  }

}
