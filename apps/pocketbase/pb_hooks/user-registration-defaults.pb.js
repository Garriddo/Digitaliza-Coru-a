/// <reference path="../pb_data/types.d.ts" />
onRecordCreate((e) => {
  // Set plan to null (empty) and estado to 'no_activo' for new registrations
  e.record.set("plan", null);
  e.record.set("estado", "no_activo");
  e.next();
}, "users");