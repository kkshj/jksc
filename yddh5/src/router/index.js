import Vue from 'vue'
import Router from 'vue-router'

const HomeComponent = () => import('@/components/home.component');
const PersonalComponent = () => import('@/components/personal.component');
const ConsultationComponent = () => import('@/components/consultation.component');
const AddressListComponent = () => import('@/components/address/list.component');
const AddressEditComponent = () => import('@/components/address/edit.component');
const PrescriptionListComponent = () => import('@/components/prescription/list.component');
const PrescriptionDetailComponent = () => import('@/components/prescription/detail.component');
const PrescriptionPaymentComponent = () => import('@/components/prescription/payment.component');
const RegisterLoginComponent = () => import('@/components/register-login.component');
const DoctorListComponent = () => import('@/components/doctor/list.component');
const DoctorDetailComponent = () => import('@/components/doctor/detail.component');
const DoctorPaymentComponent = () => import('@/components/doctor/payment.component');
const NurseListComponent = () => import('@/components/nurse/list.component');
const NurseDetailComponent = () => import('@/components/nurse/detail.component');
const NursePaymentComponent = () => import('@/components/nurse/payment.component');
const PatientEditComponent = () => import('@/components/patient/edit.component');
const PatientHealthRecordsComponent = () => import('@/components/patient/health-records.component');
const PatientManagerComponent = () => import('@/components/patient/manager.component');
const PatientCardCreateComponent = () => import('@/components/patient/card-create.component');
const PatientCardComponent = () => import('@/components/patient/card.component');
const CouponChoseComponent = () => import('@/components/coupon/chose.component');
const CouponListComponent = () => import('@/components/coupon/list.component');
const SearchComponent = () => import('@/components/search.component');
const FollowComponent = () => import('@/components/follow.component');
const InquisitionListComponent = () => import('@/components/inquisition/list.component');
const InquisitionDetailComponent = () => import('@/components/inquisition/detail.component');
const InquisitionEvaluateComponent = () => import('@/components/inquisition/evaluate.component');
const ChatComponent = () => import('@/components/chat/main.component');
const OutPageComponent = () => import('@/components/out-page.component');

Vue.use(Router)

const routes = [
  {path: '/', redirect: '/register-login'},
  {path: '/home', component: HomeComponent},
  {path: '/personal', component: PersonalComponent},
  {path: '/consultation', component: ConsultationComponent},
  {path: '/address', component: AddressListComponent},
  {path: '/address/:id', component: AddressEditComponent},
  {path: '/prescription', component: PrescriptionListComponent},
  {path: '/prescription/:id', component: PrescriptionDetailComponent},
  {path: '/prescription/payment/:id', component: PrescriptionPaymentComponent},
  {path: '/register-login', component: RegisterLoginComponent},
  {path: '/doctor', component: DoctorListComponent},
  {path: '/doctor/:id', component: DoctorDetailComponent},
  {path: '/doctor/:id/payment', component: DoctorPaymentComponent},
  {path: '/patient', component: PatientManagerComponent},
  {path: '/patient/edit', component: PatientEditComponent},
  {path: '/patient/card/:id', component: PatientCardComponent},
  {path: '/patient/card/create/:id', component: PatientCardCreateComponent},
  {path: '/patient/health-records', component: PatientHealthRecordsComponent},
  {path: '/coupon', component: CouponListComponent},
  {path: '/coupon/chose', component: CouponChoseComponent},
  {path: '/search', component: SearchComponent},
  {path: '/follow', component: FollowComponent},
  {path: '/inquisition', component: InquisitionListComponent},
  {path: '/inquisition/:id', component: InquisitionDetailComponent},
  {path: '/inquisition/evaluate/:id', component: InquisitionEvaluateComponent},
  {path: '/nurse', component: NurseListComponent},
  {path: '/nurse/:id', component: NurseDetailComponent},
  {path: '/nurse/:id/payment', component: NursePaymentComponent},
  {path: '/chat/:id', component: ChatComponent},
  {path: '/out-page', component: OutPageComponent},
]

const router = new Router({
  routes
})

router.beforeEach((to, from, next) => {  // 路由守卫
  const toPath = to.path;
  let home = /home/g;
  let doctor = /doctor/g;
  let nurse = /nurse/g;
  let payment = /payment/g;
  let registerAndLogin = /register-login/g;
  let token = localStorage.getItem('loginInfo');
  if (!((home.exec(toPath) || doctor.exec(toPath) || nurse.exec(toPath)) && !payment.exec(toPath))) {
    if (!token && !registerAndLogin.exec(toPath)) {
      router.push('/register-login');
    }
  }
  next();
});

export default router
