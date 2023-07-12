export default class MemberDefinition {
  constructor(id,firstname, lastname, birthday, mothersName, fathersName, gender,adress, cityDefinition, belt, dateOfMembership, totalDebt,competitorDefinition, membershipFeesDefinition) {
    this.id= id;
    this.firstname = firstname;
    this.lastname = lastname;
    this.birthday = birthday;
    this.mothersName = mothersName;
    this.fathersName = fathersName;
    this.gender= gender;
    this.adress = adress;
    this.cityDefinition = cityDefinition;
    this.belt = belt;
    this.dateOfMembership = dateOfMembership;
    this.totalDebt= totalDebt;
    this.competitorDefinition= competitorDefinition;
    this.membershipFeesDefinition= membershipFeesDefinition;
  }
}
