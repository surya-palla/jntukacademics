import { Component } from '@angular/core';
import { BackendService } from '../services/backend/backend.service';

@Component({
	selector: 'app-upload.supply-results',
	templateUrl: './upload.supply-results.component.html',
	styleUrls: ['./upload.supply-results.component.css']
})
export class UploadSupplyResultsComponent {

	constructor(private bk: BackendService) { }

	class_name: String = ''
	changeClass() {
		if (this.class_name == '') {
			this.class_name = 'toggle-sidebar'
		} else {
			this.class_name = ''
		}
	}

	ngOnInit(): void {
	}

	year: String = ''
	semester: String = ''
	regulation: String = ''
	subjects: any = []

	checkParams() {
		if (this.regulation != '' && this.year != '' && this.semester != '') {
			this.getRegulation({ regulation_: this.regulation, year: this.year, semester: this.semester });
		}
	}

	getRegulation(params: any) {
		console.log(params)
		this.bk.post('/regulation/subjects', params).subscribe(data => {
			this.subjects = Object.entries(data.subjects)
		})
	}

	uploadResult(formData: any) {
		if (formData.roll == '') {
			alert('Please enter a roll number.')
			return
		}
		let pdata: Record<string, any> = {
			roll: formData.roll,
			year: formData.year,
			semester: formData.semester,
			regulation: formData.regulation_,
		}
		delete formData.roll
		delete formData.year
		delete formData.semester
		delete formData.regulation_
		let subjects: Record<string, any> = {}
		for (const [k, v] of Object.entries(formData)) {
			if (v != "") {
				subjects[k] = v
			}
		}
		pdata['subjects'] = subjects
		console.log(pdata)
		this.bk.post('/admin/upload-supplyresult', pdata).subscribe(data => {
			if (data.errno != undefined) {
				alert("result not inserted")
			} else {
				alert("result inserted")
				window.location.reload()
			}
		})
	}

}
