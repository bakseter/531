package net.bakseter.api.schema

import kotlinx.serialization.Serializable
import org.jetbrains.exposed.sql.Column
import org.jetbrains.exposed.sql.ReferenceOption
import org.jetbrains.exposed.sql.Table

@Serializable
data class JokerJson(
    val joker: List<Boolean>,
)

object Joker : Table("joker") {
    val cycle: Column<Int> = integer("cycle")
    val week: Column<Int> = integer("week").check("valid_week") { it inList validWeeks }
    val day: Column<Int> = integer("day").check("valid_day") { it inList validDays }
    val num: Column<Int> = integer("num")

    override val primaryKey: PrimaryKey = PrimaryKey(Workout.cycle, Workout.week, Workout.day)

    init {
        foreignKey(
            cycle to Workout.cycle,
            week to Workout.week,
            day to Workout.day,
            onUpdate = ReferenceOption.RESTRICT,
            onDelete = ReferenceOption.RESTRICT
        )
    }
}
