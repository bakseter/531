package net.bakseter.api.schema

import org.jetbrains.exposed.sql.Column
import org.jetbrains.exposed.sql.ReferenceOption
import org.jetbrains.exposed.sql.Table

object Joker : Table("joker") {
    val email: Column<String> = text("email")
    val profile: Column<Int> = integer("profile").check("valid_profile") { it inList validProfile }
    val cycle: Column<Int> = integer("cycle")
    val week: Column<Int> = integer("week").check("valid_week") { it inList validWeeks }
    val day: Column<Int> = integer("day").check("valid_day") { it inList validDays }
    val num: Column<Int> = integer("num")

    override val primaryKey: PrimaryKey = PrimaryKey(email, profile, cycle, week, day, num)

    init {
        foreignKey(
            email to Workout.email,
            profile to Workout.profile,
            cycle to Workout.cycle,
            week to Workout.week,
            day to Workout.day,
            onUpdate = ReferenceOption.RESTRICT,
            onDelete = ReferenceOption.RESTRICT
        )
    }
}
