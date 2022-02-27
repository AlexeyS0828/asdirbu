import { Component, OnInit, ViewChild } from '@angular/core';
import { BlogService } from 'src/app/services/blog.service';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
import { RichTextEditor} from '@syncfusion/ej2-richtexteditor';
import { environment } from 'src/environments/environment';

@Component({
	selector: 'app-blog',
	templateUrl: './blog.component.html',
	styleUrls: ['./blog.component.css']
})

export class BlogComponent implements OnInit {

	dtOptions: DataTables.Settings = {};
	blogList = [];
	errorMessage = '';
	dataTable: any;
	addBlog: FormGroup;
	blogId:number = 0;
	@ViewChild('dataTable', { static: false }) table;
	documentTypes: any = ['pdf', 'docx', 'doc', 'jpg', 'jpeg'];
	defaultRTE: RichTextEditor = new RichTextEditor({});
	show:boolean = false;
	insertImageSettings: object = {
		saveUrl: `${environment.origin}/public/media`,
		path: `${environment.imageUrl}`,
	};
	@ViewChild("textEditor") textEditor:RichTextEditor;
    public tools: object = {
		type: 'MultiRow',
		items: [
		'Bold', 'Italic', 'Underline', 'StrikeThrough', '|',
		'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',
		'LowerCase', 'UpperCase', '|', 'Undo', 'Redo', '|',
		'Formats', 'Alignments', '|', 'OrderedList', 'UnorderedList', '|',
		'Indent', 'Outdent', '|', 'CreateLink', 'CreateTable',
		'Image', '|', 'ClearFormat', 'Print', 'SourceCode', '|']
  };
	constructor(private blogService: BlogService, private formBuilder: FormBuilder) { }

	ngOnInit(): void {
		this.getBlogList();
		this.addBlog = this.formBuilder.group({
			name: ['', Validators.required],
			description: ['', Validators.required],
			image: [''],
		});
	}
	openModel(openModal) {
		this.blogId = 0;
		(<HTMLInputElement>document.getElementById("image")).value = "";
		this.errorMessage = "";
		this.addBlog.reset();
		openModal.click();
		this.show = true;
	}
	blogFormSubmit(closeModal) {
		if (this.addBlog.valid) {
			let form = new FormData();
			form.append("name", this.addBlog.value.name);
			form.append("description", this.addBlog.value.description);
			form.append("image", this.addBlog.value.image);
			form.append("blogId", this.blogId.toString());
		    this.blogService.storeBlog(form).subscribe(response => {
				if (response.success) {
					closeModal.click();
					this.dataTable.destroy();
					this.getBlogList();
				}
				else {
					this.errorMessage = response.message;
				}
			});
		} else {
			this.addBlog.markAllAsTouched();
		}
	}


	onImagePicked(event: Event) {
		const file = (event.target as HTMLInputElement).files[0];
		if (!(file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg')) {
			this.errorMessage = "Įkelkite galiojantį vaizdo failą";
			return;
		}
		else if(file.size>10000000){
			this.errorMessage = "Didžiausias įkeliamo failo dydis - 10 mb";
			return;
		}
		this.addBlog.patchValue({ image: file });
		this.addBlog.get('image').updateValueAndValidity();
	}

	load() {
		this.dataTable = $(this.table.nativeElement).DataTable({
			responsive: true,
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
				},
			}
		});
	}
	getBlogList() {
		this.blogService.getBlogList().subscribe(response => {
			if (response.success) {
				this.errorMessage = '';
				this.blogList = response.data;
				setTimeout(() => { this.load(); }, 100);
			}
			else {
				this.errorMessage = response.message;
			}
		}, error => {
			this.errorMessage = "Klaida, bandykite dar kartą.";
		});
	}

	deleteBlogById(id) {
		Swal.fire({
			title: 'Ar tikrai norite ištrinti vartotoją ?',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Taip',
			cancelButtonText: 'Ne'
		}).then((result) => {
			if (result.value) {
				const form = { blogId: id };
				this.blogService.deleteBlogById(form).subscribe(response => {
					if (response.success) {
						this.dataTable.destroy();
						this.getBlogList();
					}
					else {
						this.errorMessage = response.message;
					}
				}, error => {
					this.errorMessage = "Klaida, bandykite dar kartą.";
				});
			}
		});
	}

	updateBlogById(blogId,openModal){
		const form = {blogId}
		this.blogId = blogId;
		(<HTMLInputElement>document.getElementById("image")).value = "";
		this.errorMessage = "";
		this.blogService.getBlogDetailsById(form).subscribe(response=>{
			if(response.success){
				this.addBlog.patchValue({
					name:response.data.name,
					description:response.data.description,
				});
				this.addBlog.get("name").updateValueAndValidity();
				this.addBlog.get("description").updateValueAndValidity();
				openModal.click();
				this.show = true;
			}
			else{
				this.errorMessage= response.message;
			}
		},error=>{
			this.errorMessage= "Klaida, bandykite dar kartą.";
		})
	}
}


