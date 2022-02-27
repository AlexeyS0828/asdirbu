import { Component, OnInit, ViewChild } from '@angular/core';
import { TransactionService } from 'src/app/services/transaction.service';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { ltLocale } from 'ngx-bootstrap/locale';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
defineLocale("lt", ltLocale);

@Component({
	selector: 'app-transaction',
	templateUrl: './transaction.component.html',
	styleUrls: ['./transaction.component.css']
})

export class TransactionComponent implements OnInit {

	transctionHistory = [];
	userType: number = 1;
	dtOptions: DataTables.Settings = {};
	errorMessage = '';
	index = 1;
	dataTable: any;
	message:string;
	@ViewChild('dataTable', { static: false }) table;

	constructor(
		private transactionService:TransactionService,
		private bsLocaleService: BsLocaleService
	) {
		this.bsLocaleService.use("lt");
	 }

	ngOnInit(): void {
		this.getTransactionHistroy();
	}

	
	load() {
		this.dataTable = $(this.table.nativeElement).DataTable({
			responsive:true,
			"language": {
			"lengthMenu": "Ekranas _MENU_ įrašų viename puslapyje",
			"zeroRecords": "Įrašas nerastas",
			 "info": "Rodomas puslapis _PAGE_ of _PAGES_",
			 "infoEmpty": "Įrašų nėra",
			"infoFiltered": "(filtruojamas iš _MAX_ viso įrašų)",
			"search": "Paieška",
			"paginate": {
				"first": "Pirmas",
				"last": "paskutinis",
				"next": "Kitas",
				"previous": "Ankstesnis"
			}},
			"footerCallback": function ( row, data, start, end, display ) {
				var api = this.api();
	 
				// Total over all pages
				var intVal = function ( i ) {
					return typeof i === 'string' ? Number(i.replace(/[\$,]/g, ''))*1 :	typeof i === 'number' ? i : 0;
				};

				let secondColumnTotal = api
					.column( 2 )
					.data()
					.reduce( function (a, b) {
						return intVal(a) + intVal(b);
					}, 0 );

					let fourthColumnTotal = api
						.column( 4 )
						.data()
						.reduce( function (a, b) {
							return intVal(a) + intVal(b);
						}, 0 );
					let nineColumnTotal = api
						.column( 9 )
						.data()
						.reduce( function (a, b) {
							return intVal(a) + intVal(b);
						}, 0 );
					let tenthColumnTotal = api
					.column( 10 )
					.data()
					.reduce( function (a, b) {
						return intVal(a) + intVal(b);
					}, 0 );
					let elevenColumnTotal = api
					.column( 11 )
					.data()
					.reduce( function (a, b) {
						return intVal(a) + intVal(b);
					}, 0 );
					let eightColumnTotal = api
					.column( 8 )
					.data()
					.reduce( function (a, b) {
						return intVal(a) + intVal(b);
					}, 0 );
					$( api.column( 0 ).footer() ).html('Total');
					$( api.column( 2 ).footer() ).html(Number(secondColumnTotal).toFixed(2));
					$( api.column( 4 ).footer() ).html(Number(fourthColumnTotal).toFixed(2));
					$( api.column( 8 ).footer() ).html(Number(eightColumnTotal).toFixed(2));
					$( api.column( 9 ).footer() ).html(Number(nineColumnTotal).toFixed(2));
					$( api.column( 10 ).footer() ).html(Number(tenthColumnTotal).toFixed(2));
					$( api.column( 11 ).footer() ).html(Number(elevenColumnTotal).toFixed(2));
			},
		});
	}
	
	getTransactionHistroy() {
		this.transactionService.getTransactionHistroy().subscribe(response => {
			if (response.success) {
				this.errorMessage = '';
				this.transctionHistory = response.data;
				setTimeout(()=>{this.load();},100);
		    }
			else {
				this.errorMessage = response.message;
			}
		}, error => {
			this.errorMessage = "Klaida, bandykite dar kartą.";
		});
	}

	changeTransactionStatus(transctionId, status) {
		this.message = ((status==1) ? "Ar tikrai norite baigti ?" : "Ar tikrai norite neužbaigti ?");		
		Swal.fire({
			title: this.message,
			icon: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Taip',
			cancelButtonText: 'Ne'
		}).then((result) => {
			if (result.value) {
				const params = { transctionId:transctionId,status:status };
				this.transactionService.changeTransactionStatus(params).subscribe(response => {
					if (response.success) {
						this.dataTable.destroy();
						this.getTransactionHistroy();
					}
				});
			}
		});
	}
	onCalendarValueChange(value: Date) {
        const startDate = new DatePipe('en-US').transform(value[0], 'yyyy-MM-dd');
        const endDate = new DatePipe('en-US').transform(value[1], 'yyyy-MM-dd');
		const params = {startDate,endDate};
		this.transactionService.getTransactionByDate(params).subscribe(response => {
			if (response.success) {
				this.errorMessage = '';
				this.transctionHistory = response.data;
				this.dataTable.destroy();
				setTimeout(()=>{this.load();},100);
		    }
			else {
				this.errorMessage = response.message;
			}
		}, error => {
			this.errorMessage = "Klaida, bandykite dar kartą.";
		});	
	}
}
