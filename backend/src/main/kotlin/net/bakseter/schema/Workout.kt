package net.bakseter.schema

import kotlinx.serialization.Serializable
import org.jetbrains.exposed.sql.Column
import org.jetbrains.exposed.sql.Table

@Serializable
data class WorkoutJson(
    val cycle: Int,
    val week: Int,
    val day: Int,
    val reps: Int,
)

val validWeeks = listOf(1, 2, 3, 4)
val validDays = listOf(1, 2, 3)

object Workout : Table("workout") {
    val cycle: Column<Int> = integer("cycle")
    val week: Column<Int> = integer("week").check("valid_week") { it inList validWeeks }
    val day: Column<Int> = integer("day").check("valid_day") { it inList validDays }
    val reps: Column<Int> = integer("reps")

    override val primaryKey: PrimaryKey = PrimaryKey(cycle, week, day)
}
