import { Component } from '@angular/core';
import { BackendService } from '../services/backend/backend.service';
import * as XLSX from 'xlsx';

@Component({
	selector: 'app-upload.results.csv',
	templateUrl: './upload.results.csv.component.html',
	styleUrls: ['./upload.results.csv.component.css']
})
export class UploadResultsCsvComponent {


	constructor(private bk: BackendService) { }

	year: String = ''
	semester: String = ''
	regulation: String = ''
	subjects: any = []
	result_element: any = []

	class_name: String = ''
	changeClass() {
		if (this.class_name == '') {
			this.class_name = 'toggle-sidebar'
		} else {
			this.class_name = ''
		}
	}

	ngOnInit() {
	}

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

	uploadResults() {
		if (this.regulation == '' || this.year == '' || this.semester == '') {
			alert('fill required details')
			location.reload()
			return
		}
		let i = 0, n = this.result_element.length
		for (const obj of this.result_element) {
			console.log(obj)
			this.bk.post('/admin/upload-result', obj).subscribe(data => {
				++i
				if (data.errno != undefined) {
					console.log(obj.roll + " result not inserted")
				} else {
					console.log(obj.roll + " result inserted")
				}
				if (i == n) {
					alert('results uploaded successfully')
					location.reload()
				}
			})
		}
	}

	changeExcelFile(event: any) {
		const excel_file = event.target.files.item(0)
		this.readExcelFile(excel_file)
	}

	readExcelFile(file: File) {
		const reader = new FileReader()
		reader.onload = (e: any) => {
			const data = new Uint8Array(e.target.result)
			const workbook = XLSX.read(data, { type: 'array' })
			const sheetName = workbook.SheetNames[0]
			const worksheet = workbook.Sheets[sheetName]
			const excelData: any = XLSX.utils.sheet_to_json(worksheet, { raw: true })
			this.result_element = []
			for (let i = 0; i < excelData.length; i++) {
				let result: Record<string, any> = excelData[i]
				let roll = result['roll']
				delete result['roll']
				this.result_element.push({
					roll: roll,
					year: this.year,
					semester: this.semester,
					regulation: this.regulation,
					subjects: result
				})
			}
		}
		reader.readAsArrayBuffer(file)
	}

}
