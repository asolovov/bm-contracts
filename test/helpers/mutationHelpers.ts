import {IMutations} from "../../typechain-types";
import {DamageType, MutationCheckType, MutationType, SchoolType} from "../types/types";
import {expect} from "chai";
import {assertSpellChecks} from "./checksHelpers";

export function assertMutation(result: IMutations.MutationStruct, target: IMutations.MutationStruct, id: number) {
    expect(result.id).to.be.equal(id);
    expect(result.description).to.be.equal(target.description);
    expect(result.mutationType).to.be.equal(target.mutationType);
    expect(result.spellChecks.length).to.be.equal(target.spellChecks.length);
    expect(result.mutateDamage).to.be.equal(target.mutateDamage);
    expect(result.points).to.be.equal(target.points);
    expect(result.statusID).to.be.equal(target.statusID);

    for (let i = 0; i < target.spellChecks.length; i++) {
        assertSpellChecks(result.spellChecks[i], target.spellChecks[i]);
    }
}

export const blockStatuses: IMutations.MutationStruct = {
    id: 0,
    description: "Block all statuses",
    mutationType: MutationType.BLOCK_ALL_STATUSES,
    spellChecks: [],
    mutateDamage: DamageType.UNKNOWN,
    points: 0,
    statusID: 0,
}

export const decreaseDamage1IfDamageMoreThan1: IMutations.MutationStruct = {
    id: 0,
    description: "If damage is more than 1 decrease it on 1",
    mutationType: MutationType.DECREASE_DAMAGE,
    spellChecks: [
        {
            checkType: MutationCheckType.SPELL_DAMAGE_MORE,
            damageType: DamageType.UNKNOWN,
            damageSchool: SchoolType.UNKNOWN,
            points: 1,
            statusID: 0,
        }
    ],
    mutateDamage: DamageType.CLASSIC,
    points: 1,
    statusID: 0,
}

export const healingToClassic: IMutations.MutationStruct = {
    id: 0,
    description: "Mutate healing damage to classic",
    mutationType: MutationType.CHANGE_DAMAGE_TYPE,
    spellChecks: [
        {
            checkType: MutationCheckType.SPELL_DAMAGE_TYPE,
            damageType: DamageType.HEALING,
            damageSchool: SchoolType.UNKNOWN,
            points: 0,
            statusID: 0,
        }
    ],
    mutateDamage: DamageType.CLASSIC,
    points: 0,
    statusID: 0,
}

export const setDamageToHP: IMutations.MutationStruct = {
    id: 0,
    description: "Set damage to HP to 1",
    mutationType: MutationType.SET_DAMAGE_TO_HP,
    spellChecks: [],
    mutateDamage: DamageType.UNKNOWN,
    points: 1,
    statusID: 0,
}

export const increasePiercing: IMutations.MutationStruct = {
    id: 0,
    description: "Increase piercing damage +1",
    mutationType: MutationType.INCREASE_DAMAGE,
    spellChecks: [
        {
            checkType: MutationCheckType.SPELL_DAMAGE_TYPE,
            damageType: DamageType.PIERCING,
            damageSchool: SchoolType.UNKNOWN,
            points: 0,
            statusID: 0,
        }
    ],
    mutateDamage: DamageType.UNKNOWN,
    points: 1,
    statusID: 0,
}

export const blockPiercing: IMutations.MutationStruct = {
    id: 0,
    description: "Block all piercing damage",
    mutationType: MutationType.SET_DAMAGE,
    spellChecks: [
        {
            checkType: MutationCheckType.SPELL_DAMAGE_TYPE,
            damageType: DamageType.PIERCING,
            damageSchool: SchoolType.UNKNOWN,
            points: 0,
            statusID: 0,
        }
    ],
    mutateDamage: DamageType.UNKNOWN,
    points: 0,
    statusID: 0,
}

export const classicToPiercing: IMutations.MutationStruct = {
    id: 0,
    description: "Classic damage mutates to piercing",
    mutationType: MutationType.CHANGE_DAMAGE_TYPE,
    spellChecks: [
        {
            checkType: MutationCheckType.SPELL_DAMAGE_TYPE,
            damageType: DamageType.CLASSIC,
            damageSchool: SchoolType.UNKNOWN,
            points: 0,
            statusID: 0,
        }
    ],
    mutateDamage: DamageType.PIERCING,
    points: 0,
    statusID: 0,
}

export function getBlockBurnsMutation(statusID: number): IMutations.MutationStruct {
    return {
        id: 0,
        description: "Protect against Burns status",
        mutationType: MutationType.BLOCK_STATUS,
        spellChecks: [],
        mutateDamage: DamageType.UNKNOWN,
        points: 0,
        statusID: statusID,
    }
}

export function getBlockIgnitionMutation(statusID: number): IMutations.MutationStruct {
    return {
        id: 0,
        description: "Protect against Burns status",
        mutationType: MutationType.BLOCK_STATUS,
        spellChecks: [],
        mutateDamage: DamageType.UNKNOWN,
        points: 0,
        statusID: statusID,
    }
}

export const classicToHealingFire: IMutations.MutationStruct = {
    id: 0,
    description: "Classic damage mutates to healing if school is Fire",
    mutationType: MutationType.CHANGE_DAMAGE_TYPE,
    spellChecks: [
        {
            checkType: MutationCheckType.SPELL_SCHOOL,
            damageType: DamageType.UNKNOWN,
            damageSchool: SchoolType.FIRE,
            points: 0,
            statusID: 0,
        },
        {
            checkType: MutationCheckType.SPELL_DAMAGE_TYPE,
            damageType: DamageType.CLASSIC,
            damageSchool: SchoolType.UNKNOWN,
            points: 0,
            statusID: 0,
        }
    ],
    mutateDamage: DamageType.HEALING,
    points: 0,
    statusID: 0,
}

export const blockShieldDamage: IMutations.MutationStruct = {
    id: 0,
    description: "Block shield damage",
    mutationType: MutationType.BLOCK_SHIELD_DAMAGE,
    spellChecks: [],
    mutateDamage: DamageType.UNKNOWN,
    points: 0,
    statusID: 0,
}