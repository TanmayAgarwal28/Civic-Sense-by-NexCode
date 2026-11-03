import { EventEmitter } from 'events';
import { app } from './src/server.js';
import { resetDatabase } from './src/db/database.js';

// In-memory HTTP mock for isolated testing without network socket
function mockRequest(app, method, url, body = null) {
  return new Promise((resolve) => {
    const req = new EventEmitter();
    req.method = method;
    req.url = url;
    req.headers = {
      'content-type': 'application/json',
      host: 'localhost'
    };

    const res = new EventEmitter();
    let resData = '';
    res.statusCode = 200;
    res.headers = {};

    res.setHeader = (key, val) => {
      res.headers[key.toLowerCase()] = val;
    };
    res.getHeader = (key) => res.headers[key.toLowerCase()];

    res.status = (code) => {
      res.statusCode = code;
      return res;
    };

    res.json = (data) => {
      res.setHeader('content-type', 'application/json');
      resolve({ status: res.statusCode, data });
    };

    res.send = (data) => {
      if (typeof data === 'object') {
        resolve({ status: res.statusCode, data });
      } else {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      }
    };

    res.end = (chunk) => {
      if (chunk) resData += chunk;
      try {
        resolve({ status: res.statusCode, data: JSON.parse(resData) });
      } catch (e) {
        resolve({ status: res.statusCode, raw: resData });
      }
    };

    req.body = body || {};
    app(req, res);
  });
}

async function runApiTests() {
  console.log('================================================================');
  console.log('   CivicSense In-Memory API & Business Logic Integration Suite  ');
  console.log('================================================================');

  try {
    // Reset database to pristine state before test run
    resetDatabase();
    // 1. Health check
    const health = await mockRequest(app, 'GET', '/api/health');
    console.log(`1. Health Check: status=${health.status}, system="${health.data?.status}"`);
    if (health.status !== 200 || health.data?.status !== 'online') throw new Error('Health check failed');
    console.log('   ✓ Health check passed!');

    // 2. Admin Login
    const adminLogin = await mockRequest(app, 'POST', '/api/auth/login', {
      username: 'CampusAdminX1',
      password: 'CivicSecure#2026',
      role: 'admin'
    });
    console.log(`2. Admin Login: status=${adminLogin.status}, user="${adminLogin.data?.user?.name}"`);
    if (adminLogin.status !== 200 || adminLogin.data?.user?.role !== 'admin') throw new Error('Admin login failed');
    console.log('   ✓ Admin login verified!');

    // 3. Worker Login
    const workerLogin = await mockRequest(app, 'POST', '/api/auth/login', {
      username: 'WRK-ELEC01',
      password: 'worker@123',
      role: 'worker'
    });
    console.log(`3. Worker Login: status=${workerLogin.status}, dept="${workerLogin.data?.user?.department}"`);
    if (workerLogin.status !== 200 || workerLogin.data?.user?.role !== 'worker') throw new Error('Worker login failed');
    console.log('   ✓ Worker login verified!');

    // 4. Student Pre-Admission Verification (Match)
    const stuReg = await mockRequest(app, 'POST', '/api/auth/student-register', {
      rollNo: 'ASU2026-106',
      name: 'Demo Applicant',
      password: 'student@123',
      phone: '0000000000'
    });
    console.log(`4. Student Admission Roster Check (Match): status=${stuReg.status}, msg="${stuReg.data?.message}"`);
    if (stuReg.status !== 201) throw new Error('Student admission registration failed');
    console.log('   ✓ Student verified against campus admission roster and created!');

    // 5. Student Registration (Mismatch Rejected)
    const stuRegMismatch = await mockRequest(app, 'POST', '/api/auth/student-register', {
      rollNo: 'ASU2026-999',
      name: 'Unknown Imposter',
      password: 'pass'
    });
    console.log(`5. Student Admission Roster Check (Mismatch): status=${stuRegMismatch.status}`);
    if (stuRegMismatch.status !== 400) throw new Error('Failed to reject unverified student');
    console.log('   ✓ Unlisted student correctly rejected by admission roster validation!');

    // 6. Admin Toggle Student Access Switch (ON/OFF)
    const toggleOff = await mockRequest(app, 'PATCH', '/api/admin/users/usr_stu_01/toggle');
    console.log(`6. Admin Toggle Student Access: status=${toggleOff.status}, isActive=${toggleOff.data?.data?.isActive}`);
    if (toggleOff.status !== 200) throw new Error('Student toggle failed');
    console.log('   ✓ Student on/off access switch functional!');

    // 7. Suspended Student Login Check
    const suspendedLogin = await mockRequest(app, 'POST', '/api/auth/login', {
      username: 'ASU2026-101',
      password: 'student@123',
      role: 'student'
    });
    console.log(`7. Suspended Student Login Block: status=${suspendedLogin.status}, msg="${suspendedLogin.data?.message}"`);
    if (suspendedLogin.status !== 403) throw new Error('Suspended student should be denied access');
    console.log('   ✓ Suspended student access successfully blocked!');

    // Reactivate student for remaining tests
    await mockRequest(app, 'PATCH', '/api/admin/users/usr_stu_01/toggle');

    // 8. Admin Create Worker
    const createWrk = await mockRequest(app, 'POST', '/api/admin/workers', {
      username: 'WRK-CIVIL01',
      name: 'Demo Worker',
      department: 'Civil Infrastructure',
      phone: '0000000000',
      password: 'worker@123'
    });
    console.log(`8. Admin Create Worker: status=${createWrk.status}, worker="${createWrk.data?.data?.name}"`);
    if (createWrk.status !== 201) throw new Error('Create worker failed');
    console.log('   ✓ Worker profile created successfully!');

    // 9. Admin Dynamic Category CRUD
    const addCat = await mockRequest(app, 'POST', '/api/admin/categories', {
      en: 'HVAC & Air Conditioning',
      as: 'শীত-তাপ নিয়ন্ত্ৰণ শাখা',
      defaultDept: 'HVAC Services'
    });
    console.log(`9. Admin Add Category: status=${addCat.status}, catId="${addCat.data?.data?.id}"`);
    if (addCat.status !== 201) throw new Error('Add category failed');
    const delCat = await mockRequest(app, 'DELETE', `/api/admin/categories/${addCat.data.data.id}`);
    if (delCat.status !== 200) throw new Error('Delete category failed');
    console.log('   ✓ Dynamic category addition & deletion verified!');

    // 10. Admin Dynamic Location CRUD
    const addLoc = await mockRequest(app, 'POST', '/api/admin/locations', {
      en: 'Auditorium Complex',
      as: 'প্ৰেক্ষাগৃহ চৌহদ'
    });
    console.log(`10. Admin Add Location: status=${addLoc.status}, locId="${addLoc.data?.data?.id}"`);
    if (addLoc.status !== 201) throw new Error('Add location failed');
    const delLoc = await mockRequest(app, 'DELETE', `/api/admin/locations/${addLoc.data.data.id}`);
    if (delLoc.status !== 200) throw new Error('Delete location failed');
    console.log('   ✓ Dynamic location addition & deletion verified!');

    // 11. Admin AI Auto-Dispatch Toggle
    const updateSetting = await mockRequest(app, 'PATCH', '/api/admin/settings', {
      aiAutoDispatch: false
    });
    console.log(`11. Admin Dispatch Mode Toggle: status=${updateSetting.status}, autoDispatch=${updateSetting.data?.data?.aiAutoDispatch}`);
    if (updateSetting.status !== 200 || updateSetting.data?.data?.aiAutoDispatch !== false) throw new Error('Settings update failed');
    console.log('   ✓ AI Auto-Dispatch toggle policy verified!');

    // Reset setting back to true
    await mockRequest(app, 'PATCH', '/api/admin/settings', { aiAutoDispatch: true });

    // 12. Submit Grievance with Dedicated Specific Address
    const submitGrievance = await mockRequest(app, 'POST', '/api/issues', {
      title: 'Water filter leaking near Room 102',
      description: 'Drinking water dispenser filter in front of Room 102 is continuously leaking and overflowing on the corridor floor.',
      address: 'Academic Block A, Ground Floor, Corridor Outside Room 102',
      location: 'Academic Block A (Engineering)',
      zoneId: 'academic_block_a',
      category: 'water',
      reporterName: 'Demo Student One',
      reporterRole: 'student'
    });
    console.log(`12. Submit Grievance with Address: status=${submitGrievance.status}, ticketId="${submitGrievance.data?.data?.ticketId}"`);
    if (submitGrievance.status !== 201) throw new Error('Submit grievance failed');
    console.log('   ✓ Grievance submitted with dedicated specific address!');

    // 13. Worker Update Task Status with Resolution Notes
    const workerTaskUpdate = await mockRequest(app, 'PATCH', `/api/worker/tasks/${submitGrievance.data.data.id}`, {
      status: 'in_progress',
      resolutionNotes: 'Dispatched on-site technician. Water valve isolated, replacing filter cartridge gasket.'
    });
    console.log(`13. Worker Update Task: status=${workerTaskUpdate.status}, msg="${workerTaskUpdate.data?.message}"`);
    if (workerTaskUpdate.status !== 200) throw new Error('Worker task update failed');
    console.log('   ✓ Worker dispatch flow verified!');

    // 14. Admin Permanent Delete Work Order
    const delIssue = await mockRequest(app, 'DELETE', `/api/admin/issues/${submitGrievance.data.data.id}`);
    console.log(`14. Admin Delete Work Order: status=${delIssue.status}`);
    if (delIssue.status !== 200) throw new Error('Delete work order failed');
    console.log('   ✓ Admin permanent deletion verified!');

    // 15. Raw Database Inspector
    const rawDb = await mockRequest(app, 'GET', '/api/admin/raw-database');
    console.log(`15. Raw Database Inspector: status=${rawDb.status}, collections=[${Object.keys(rawDb.data?.data || {}).join(', ')}]`);
    if (rawDb.status !== 200 || !rawDb.data?.data?.issues) throw new Error('Raw DB inspection failed');
    console.log('   ✓ Raw database viewer functional!');

    console.log('================================================================');
    console.log('   ALL 15 INTEGRATION TESTS PASSED WITH 100% SUCCESS!          ');
    console.log('================================================================');
    process.exit(0);
  } catch (err) {
    console.error('Test suite failed:', err);
    process.exit(1);
  }
}

runApiTests();
