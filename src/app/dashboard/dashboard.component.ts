import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BarcodeFormat } from '@zxing/library';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  allowedFormats = [BarcodeFormat.QR_CODE]
  scan = false
  team_name = ''
  score = ''
  loc = ''

  showDialog = false
  question = ''
  answer = ''

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.getStats()
  }

  getStats() {
    this.http.post(environment.endpoint + '/stats', { 'username': localStorage.getItem('username') }).subscribe((res: any) => {
      this.team_name = res.team_name
      this.score = res.score
      this.loc = res.loc
    })
  }

  scanSuccessHandler(data: any) {
    this.scan = false
    if (data.includes('http')) {
      if (data == 'https://www.youtube.com/watch?v=GPXkjtpGCFI') {
        window.open('https://www.youtube.com/watch?v=GPXkjtpGCFI', '_blank')
      } else if (data == 'https://www.youtube.com/watch?v=BbeeuzU5Qc8'){
        window.open('https://www.youtube.com/watch?v=BbeeuzU5Qc8', "_blank")
      } else {
        window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ','_blank')
      }
      console.log(data)
      return
    }
    const username = localStorage.getItem('username')
    const hint = window.atob(data)
    this.http.post(environment.endpoint + '/scan', { 'username': username, 'hint': hint }).subscribe((res: any) => {
      if (res.question) {
        this.question = res.question
        this.showDialog = true
      } else if (res.message) {
        alert(res.message)
      } else {
        alert('Error getting question')
      }
    })
  }

  logout() {
    localStorage.removeItem('username')
    localStorage.removeItem('password')
    this.router.navigate(['login'])
  }

  checkAnswer() {
    const username = localStorage.getItem('username')
    const answer = this.answer
    this.http.post(environment.endpoint + '/check-answer', { 'username': username, 'answer': answer.toLowerCase().trim() }).subscribe((res: any) => {
      if (res.isCorrect) {
        this.showDialog = false
        this.answer = ''
        this.getStats()
        alert('Correct answer')
      } else {
        alert('Wrong Answer')
      }
    })
  }

}
