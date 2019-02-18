import { Component, ChangeDetectionStrategy, ElementRef, ViewChild, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { SELECT_ITEM_HEIGHT_EM } from '@angular/material';

@Component({
  selector: 'form-json-evaluator',
  templateUrl: './form-typeahead.component.html',
  styleUrls: ['./form-typeahead.component.scss']
})
export class FormTypeaheadComponent implements OnInit {
  @ViewChild("divBox") divBox: ElementRef;
  @ViewChild("parentBox") parentBox: ElementRef;
  
  @Input() jsonObject: any;
  @Input() value: string;
  @Input() rows: number = 1;

  @Output() public valueChange = new EventEmitter();
  
  typeaheadText = '';
  listCoordinates: Coordinates;
  lastXPosition: any;
  focusedIdx: number = 0;

  public query = '';
  public filteredList = [];

  constructor() {
    this.listCoordinates = new Coordinates();
  }

  ngOnInit() {
    if (this.value)
      this.typeaheadText = this.value;
  }

  filter($event) {
    if ($event != null && this.object != null && $event.value != null && this.query !== $event.value.replace(/[\n\r]+/g, '')) {
      if ($event.menuEvent) {
        switch ($event.value) {
          case 'ArrowDown':
            if (this.filteredList != null && this.focusedIdx < this.filteredList.length - 1)
              this.focusedIdx++;
          break;
          case 'ArrowUp':
            if (this.focusedIdx > 0)
              this.focusedIdx--;
          break;
          case "Enter":
            if (this.filteredList != null && this.filteredList.length > 0 && this.filteredList[this.focusedIdx] != null) {
              this.select(this.filteredList[this.focusedIdx]);
              $event.keyEvent.preventDefault();
            }
          break;
        }
      }
      else {
        this.valueChange.emit($event.value);
        this.query = $event.value;
        this.listCoordinates.y = $event.coordinates.y;
        if (this.query !== "") {
          this.query = this.query.replace(/[\n\r]+/g, '');
          let tmpQuery = this.query;
          let subObject = JSON.parse(JSON.stringify(this.object));

          if (tmpQuery.indexOf(".") != -1) {
            if (tmpQuery[tmpQuery.length - 1] == ".")
              this.listCoordinates.x = $event.coordinates.x;

            let arr = this.query.split(".");
            for (let pos = 0; pos < arr.length - 1; pos++) {
              if (arr[pos])
                subObject = subObject[arr[pos]];
              else
                subObject = null;
            }
            tmpQuery = arr[arr.length - 1];
          }
          else
            this.listCoordinates.x = 0;

          if (tmpQuery && subObject) {
            let list = Object.keys(subObject).sort((a,b) => (a > b ? 1 : -1));
            this.filteredList = list.filter(function (el) {
              return el.toLowerCase().indexOf(tmpQuery.toLowerCase()) > -1;
            }.bind(this));
          }
          else
          {
            this.filteredList = [];
            this.focusedIdx = 0;
          }
        }
        else {
          this.listCoordinates.x = 0;
          this.focusedIdx = 0;
          this.filteredList = [];
        }
      }
    }
  }


  select(item) {
    this.divBox.nativeElement.focus();
    this.typeaheadText = this.getPath(item);
    this.valueChange.emit(this.typeaheadText);
    this.filteredList = [];
  }

  getPath(item) {
    if (this.query != null && this.query.indexOf(".") != -1) {
      let subObject = this.query;
      let arr = this.query.split(".");
      let result = "";
      for (let pos = 0; pos < arr.length - 1; pos++) {
        result += arr[pos] + ".";
      }
      result += item;
      return result;
    }
    else
      return item;
  }

  public object = JSON.parse(`{
    "Id": "85d3fcee-6486-e811-8121-0cc47a480e0c",
    "Name": "Mrs Lucy Jackson",
    "Contact": {
      "Id": "85d3fcee-6486-e811-8121-0cc47a480e0c",
      "InternalId": 169462,
      "Name": "Mrs Lucy Jackson",
      "Title": "Mrs",
      "Suffix": "X",
      "FirstName": "Lucy",
      "MiddleName": "Shontelle",
      "LastName": "Jackson",
      "NiNumber": "JS 91 20 94 J",
      "PlaceOfBirth": "United Kingdom",
      "Dependent1": "Bob Marley",
      "ClientIdentificationCode": "A17399CT",
      "AlwaysOpenSrcId": {
        "Id": "89c22d01-6586-e811-8121-0cc47a480e0c",
        "LogicalName": "wdx_suitabilityreviewcontact",
        "Name": "Mrs Lucy Jackson"
      },
      "ClientCategoryId": {
        "Id": "d29dd51d-5f86-e811-8121-0cc47a480e0c",
        "LogicalName": "wdx_clientcategory",
        "Name": "Individual"
      },
      "ClientRelationshipType": {
        "Value": 892750003,
        "Text": "Not Interested"
      },
      "PEPStatus": {
        "Value": 892750000,
        "Text": "Non PEP"
      },
      "RelationshipType": {
        "Value": 1,
        "Text": "Client"
      },
      "IsOrganisation": false,
      "JobTitle": "CRMaster",
      "Occupation": "Senior CRM Consultant",
      "EmployerAddress": "99 Unicorn Lane",
      "EmployerPostCode": "PR3 1AS",
      "EmployerBusinessTelephone": "020 4557 5786",
      "PassportNumber": "6858017571",
      "EmployerName": "Wealth Dynamix",
      "StateCode": {
        "Value": 0,
        "Text": "Active"
      },
      "StatusCode": {
        "Value": 1,
        "Text": "Active"
      },
      "Gender": {
        "Value": 2,
        "Text": "Female"
      },
      "EmploymentType": {
        "Value": 892750000,
        "Text": "Full-Time Employee"
      },
      "PrimaryAddressLine1": "27 Peoples Lane",
      "PrimaryAddressCity": "Greater London",
      "PrimaryAddressCounty": "London",
      "PrimaryAddressPostCode": "E14 6QR",
      "PrimaryAddressCountryId": {
        "Id": "80d7e944-700f-4e75-b120-de65619e2598",
        "LogicalName": "wdx_country",
        "Name": "United Kingdom"
      },
      "PrimaryCode": "CON121512",
      "Telephone1": "020 0006 7758",
      "Telephone2": "020 9488 3163",
      "MobilePhone": "078 4541 2365",
      "EmailAddress1": "LucyJackson400@gmail.com",
      "EmailAddress2": "Lew-say@hotmail.com",
      "PassportExpiry": "2023-07-13T07:21:19+01:00",
      "ClientIdentificationCodeExpiryDate": "2024-07-13T07:21:19+01:00",
      "BirthDate": "1980-11-26T00:00:00+00:00",
      "Dependent1DOB": "1945-02-06T00:00:00+00:00",
      "NextBirthdayDate": "2018-11-26T12:00:00+00:00",
      "CreatedOn": "2018-07-13T07:21:19+01:00",
      "ResponsiblePartyId": {
        "Id": "021f1fa6-0b84-e811-8121-0cc47a480e0c",
        "LogicalName": "wdx_responsible_party",
        "Name": "LON_A"
      },
      "OwningBusinessUnitId": {
        "Id": "1dea314d-4b47-e611-8104-0cc47a480e0c",
        "LogicalName": "businessunit",
        "Name": null
      },
      "OwnerId": {
        "Id": "86b1f758-4e47-e611-8104-0cc47a480e0c",
        "LogicalName": "team",
        "Name": "LON_A"
      },
      "PassportCountry": {
        "Id": "80d7e944-700f-4e75-b120-de65619e2598",
        "LogicalName": "wdx_country",
        "Name": "United Kingdom"
      },
      "IsClientOwner": false,
      "IsMaster": true,
      "IsLocked": false,
      "IsAllocationRuleOverridden": false,
      "DoNotEmail": false,
      "DoNotPhone": false,
      "DoNotPostalMail": false,
      "Age": 37,
      "InvestmentsWithinThisOrganisation": 277701.9,
      "InvestmentsWithinThisOrganisationBase": 277701.9,
      "InvestmentsInfluencedWithinThisOrganisation": 338703.05,
      "InvestmentsInfluencedWithinThisOrganisationBase": 338703.05,
      "CurrencyId": {
        "Id": "559a9b03-ff48-e211-933a-525400eaa9a5",
        "LogicalName": "transactioncurrency",
        "Name": "Pound Sterling"
      },
      "Longitude": -0.010715,
      "Latitude": 51.5182592,
      "MaritalStatus": {
        "Value": 2,
        "Text": "Married"
      },
      "PreferredDay": {
        "Value": 1,
        "Text": "Monday"
      },
      "PreferredTime": {
        "Value": 2,
        "Text": "Afternoon"
      },
      "PreferredMethodofContact": {
        "Value": 2,
        "Text": "Email"
      },
      "CreationProcess": {
        "Value": 892750003,
        "Text": "Other"
      },
      "UpdateProcess": {
        "Value": 892750003,
        "Text": "Other"
      },
      "CountryOfNationalityId": {
        "Id": "80d7e944-700f-4e75-b120-de65619e2598",
        "LogicalName": "wdx_country",
        "Name": "United Kingdom"
      },
      "CountryOfNationality2Id": {
        "Id": "d0424b66-0b76-4d89-9ade-cc2fd692eeb2",
        "LogicalName": "wdx_country",
        "Name": "Turkey"
      },
      "CountryOfResidenceId": {
        "Id": "80d7e944-700f-4e75-b120-de65619e2598",
        "LogicalName": "wdx_country",
        "Name": "United Kingdom"
      },
      "CountryOfBirthId": {
        "Id": "80d7e944-700f-4e75-b120-de65619e2598",
        "LogicalName": "wdx_country",
        "Name": "United Kingdom"
      },
      "PrimaryTaxDomicileId": {
        "Id": "80d7e944-700f-4e75-b120-de65619e2598",
        "LogicalName": "wdx_country",
        "Name": "United Kingdom"
      },
      "PreferredLanguageId": {
        "Id": "7c306a97-ed07-e811-8119-0cc47a480e0c",
        "LogicalName": "wdx_language",
        "Name": "English"
      },
      "ClientJourneyStageId": {
        "Id": "7d8385d6-5e86-e811-8121-0cc47a480e0c",
        "LogicalName": "wdx_responsibleparty",
        "Name": "Prospective Client"
      },
      "AdviserJourneyStageId": {
        "Id": "758385d6-5e86-e811-8121-0cc47a480e0c",
        "LogicalName": "wdx_responsibleparty",
        "Name": "Not Engaged"
      },
      "DuplicateWarningAcknowledged": false,
      "ModifiedBy": {
        "Id": "58d97a01-322a-43a5-9f12-ce4a897c232c",
        "LogicalName": "systemuser",
        "Name": "SYSTEM"
      },
      "EntityTypeName": "contact",
      "AdditionalAttributes": {
        "address1_composite": {
          "Type": "String",
          "LogicalName": null
        }
      }
    },
    "ContactReviews": null,
    "IsOrganisation": false,
    "PrimaryAddress": {
      "Id": "00000000-0000-0000-0000-000000000000",
      "AddressReference": null,
      "EntityTypeName": "wdx_address",
      "AdditionalAttributes": null
    },
    "LastKYCCompleted": null,
    "Notes": null,
    "Opportunities": null,
    "Products": null,
    "SuitabilityReviews": null,
    "RelationshipTree": null,
    "Documents": null,
    "ClientCategory": "Trust",
    "AssociatedStaff": null,
    "AmendmentTypes": null,
    "Role": null,
    "Occupation": null,
    "OrganisationPrimaryContact": null,
    "RelationshipType": 1,
    "Errors": null
  }`);

}

export class TypeheadEvent {
  public menuEvent: boolean;
  public value: string;
  public coordinates: Coordinates;
  public keyEvent: any;
}

export class Coordinates {
  public x: any;
  public y: any;
}