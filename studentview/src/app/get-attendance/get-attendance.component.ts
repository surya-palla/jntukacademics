import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BackendService } from '../services/backend/backend.service';

@Component({
	selector: 'app-get-attendance',
	templateUrl: './get-attendance.component.html',
	styleUrls: ['./get-attendance.component.css'],
})
export class GetAttendanceComponent {
	constructor(private router: Router, private bk: BackendService) {}

	result: any = {};
	user_data: any = {};
	ryear = 0;
	rsem = 0;
	regulation = '';
	gradeMap: any = {
		10: 'O',
		9: 'S',
		8: 'A',
		7: 'B',
		6: 'C',
		5: 'D',
		0: 'F',
	};

	class_name: String = '';
	changeClass() {
		if (this.class_name == '') {
			this.class_name = 'toggle-sidebar';
		} else {
			this.class_name = '';
		}
	}

	ngOnInit(): void {
		this.ryear = 0;
		this.rsem = 0;
		this.user_data = localStorage.getItem('user_data');
		if (!this.user_data) {
			this.router.navigateByUrl('/login');
			return;
		}
		this.user_data = JSON.parse(this.user_data);
		this.regulation = this.user_data.regulation;
	}

	getResult(params: any) {
		console.log(params);
		params.roll = this.user_data.roll;
		params.regulation_ = this.user_data.regulation;
		// return
		this.bk.post('/student/result', params).subscribe((data) => {
			console.log(data);
			this.ryear = params.year;
			this.rsem = params.semester;
			var return_data = data.subjects;

			this.result.subjects = new Array();

			for (var i = 0; i < return_data.length; i++) {
				var result_item = {
					name: return_data[i].courseTitle,
					grade: return_data[i].gradePoints,
					courseCode: return_data[i].courseCode,
				};

				this.result.subjects.push(result_item);
			}
			console.log(return_data.length);
		});
	}

	getAttendance(params: any) {
		const monthsData = [
			'January',
			'February',
			'March',
			'April',
			'May',
			'June',
			'July',
			'August',
			'September',
			'October',
			'November',
			'December',
		];
		this.ryear = params.year;
		this.rsem = 2;
		params.roll = this.user_data.roll;
		this.bk.post('/student/getAttendance', params).subscribe((data) => {
			this.result.subjects = new Array();
			if (data != null) {
				var return_data = data.attendance;

				for (var i = 0; i < return_data.length; i++) {
					var result_item = {
						month: monthsData[return_data[i].month - 1],
						classesConducted: return_data[i].classesConducted,
						classesAttended: return_data[i].classesAttended,
					};

					this.result.subjects.push(result_item);
				}
			}
		});
	}
}
